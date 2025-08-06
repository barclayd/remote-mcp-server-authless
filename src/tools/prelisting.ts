import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { PrelistingSchema } from '../schemas/prelisting';

export const prelistingTool = async ({
  prelistingHash,
}: {
  prelistingHash: string;
}): Promise<CallToolResult> => {
  const response = await fetch(
    `https://www.anyvan.com/ng/prelisting/${prelistingHash}`,
    {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    },
  );

  if (!response.ok) {
    console.error('Unable to fetch response from /ng/prelisting');
  }

  const data = await response.json();

  console.log('data', data);

  if (typeof data === 'boolean') {
    return {
      content: [
        {
          type: 'text',
          text: 'This listing has already converted and is therefore no longer a valid prelisting',
        },
      ],
    };
  }

  const { listing } = PrelistingSchema.parse(data);

  const contextualData = {
    moveDate: listing.pickup_date,
    moveItems: listing.move_items?.map((moveItem) => ({
      name: moveItem?.name,
      make: moveItem?.make_name,
      model: moveItem?.model_name,
      weight: moveItem?.weight_unit,
      volume: moveItem?.volume,
      dimensionUnit: moveItem?.dimension_unit,
      weightUnit: moveItem?.weight_unit,
    })),
    moveDetails: {
      pickup: {
        floor: listing.origin_property_level,
        timings: {
          startTime: listing.pickup_time,
          endTime: listing.pickup_time_end,
        },
        property: {
          type: listing.origin_type_of_property,
          floors: listing.origin_number_floors,
          hasLift: listing.origin_property_elevator,
          parking: listing.origin_parking,
        },
        location: {
          address: listing.from,
          latitude: listing.pickup_address_data?.latitude,
          longitude: listing.pickup_address_data?.longitude,
          postcode: listing.pickup_address_data?.postcode,
          town: listing.pickup_address_data?.town,
          region: listing.pickup_address_data?.region,
        },
      },
      delivery: {
        location: {
          address: listing.to,
          latitude: listing.delivery_address_data?.latitude,
          longitude: listing.delivery_address_data?.longitude,
          postcode: listing.delivery_address_data?.postcode,
          town: listing.delivery_address_data?.town,
          region: listing.delivery_address_data?.region,
        },
        floor: listing.destination_property_level,
        property: {
          type: listing.destination_type_of_property,
          floors: listing.destination_number_floors,
          hasLift: listing.destination_property_elevator,
          parking: listing.destination_parking,
        },
      },
      details: {
        menRequired: listing.men_required,
        timeSlot: {
          selectedTimeOption: listing.selectedTimeOption,
          selectedTimeOptionType: listing.selectedTimeOptionType,
        },
        packageType: listing.packageType,
        moveCategory: listing.categoryIdent,
        totalPrice: listing.total_price,
        distance: listing.distance,
        duration: listing.duration,
      },
      priceOptions: {
        standard: listing.lowest_price?.standard,
        premium: listing.lowest_price?.premium,
      },
      services: {
        packingServiceSelected: listing.packing_service_required,
      },
    },
    car: {
      isOperational: listing.vehicle_is_operational,
    },
    contactDetails: {
      email: listing.user_info?.email,
      phoneNumber: listing.user_info?.phone_number,
      full_name: listing.user_info?.full_name,
    },
    metadata: {
      isBusinessMove: listing.job_is_for_business,
      locale: listing.locale,
      currency: listing.currency,
      isConvertedFromFurnitureToHouseMove:
        listing.isConvertedFromFurnitureToHouseMove,
      pickupPhoneNumber: listing.pickup_address_data?.phone_number,
      deliveryPhoneNumber: listing.delivery_address_data?.phone_number,
    },
    summary: {
      volumeUnits: listing.volume_units,
      weightUnits: listing.overall_weight_units,
      totalWeight: listing.overall_weight,
    },
  };

  return {
    content: [{ type: 'text', text: String(JSON.stringify(contextualData)) }],
  };
};
