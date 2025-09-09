const axios = require('axios');

// --- ENV VARIABLES ---
const DATADOG_API_KEY = process.env.DATADOG_API_KEY;

// --- Datadog Logging Utilities ---
async function logSuccessToDatadog({ message, recordId, quoteId, contactId }) {
  const datadogEndpoint = 'https://http-intake.logs.datadoghq.eu/v1/input';
  const dealLink = `https://app.hubspot.com/contacts/5468262/record/0-3/${recordId}`;
  const contactLink = `https://app.hubspot.com/contacts/5468262/record/0-1/${contactId}`;

  const logData = {
    ddsource: 'hubspot',
    ddtags: 'hubspot, custom-code, warm-contact-list',
    hostname: 'hubspot prod',
    message: JSON.stringify({ recordId, message_content: message }),
    service: 'hubspot_deal',
    status: 'success',
    hubSpotContactRecordLink: contactLink,
    hubSpotDealRecordLink: dealLink,
    recordId,
    quoteId,
  };

  try {
    await axios.post(datadogEndpoint, logData, {
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': DATADOG_API_KEY,
      },
    });
    console.log('Logged success in Datadog');
  } catch (logError) {
    console.error('Error logging success to Datadog:', logError.message);
  }
}

async function logErrorToDatadog({
  message,
  recordId,
  quoteId,
  contactId,
  error,
}) {
  const datadogEndpoint = 'https://http-intake.logs.datadoghq.eu/v1/input';
  const dealLink = `https://app.hubspot.com/contacts/5468262/record/0-3/${recordId}`;
  const contactLink = `https://app.hubspot.com/contacts/5468262/record/0-1/${contactId}`;

  const logData = {
    ddsource: 'hubspot',
    ddtags: 'hubspot, custom-code, warm-contact-list',
    hostname: 'hubspot prod',
    message: JSON.stringify({
      recordId,
      error_message: error?.message || error,
      stack: error?.stack,
      context_message: message,
    }),
    service: 'hubspot_deal',
    status: 'error',
    recordId,
    quoteId,
    hubSpotContactRecordLink: contactLink,
    hubSpotDealRecordLink: dealLink,
  };

  try {
    await axios.post(datadogEndpoint, logData, {
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': DATADOG_API_KEY,
      },
    });
    console.log('Logged error in Datadog');
  } catch (logError) {
    console.error('Error logging error to Datadog:', logError.message);
  }
}

// --- Booking Insights API Handler ---
async function getPrelistingData(prelistingHash) {
  const response = await axios.get(
    `https://www.anyvan.com/ng/prelisting/${prelistingHash}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-REQUESTED-WITH': 'XMLHttpRequest',
      },
    },
  );
  return response.data;
}

// --- Main Function ---
async function execute(event, callback) {
  console.log('--- Booking insights data retrieval workflow ---');

  const recordId = event.inputFields.hs_object_id;
  const quoteId = event.inputFields.pre_listing_id;
  const preListingURL = event.inputFields.pre_listing_url;
  const contactId = event.inputFields.contact_record_id_sync;

  if (!preListingURL) {
    const errorMessage = 'Missing required field: preListingURL is required';
    console.error(errorMessage);
    await logErrorToDatadog({
      message: errorMessage,
      recordId,
      quoteId,
      contactId,
      error: errorMessage,
    });
    return callback({ outputFields: { error: errorMessage } });
  }

  const preListingHash = preListingURL.split('/').pop();

  try {
    const prelistingData = await getPrelistingData(preListingHash);

    const pickupLines = prelistingData?.pickup_address_data?.address_line
      .filter((line) => line.length)
      .join(',');

    const deliveryLines = prelistingData?.delivery_address_data?.address_line
      .filter((line) => line.length)
      .join(',');

    await logSuccessToDatadog({
      message: 'Requested data successfully from prelisting id',
      recordId,
      quoteId,
      contactId,
    });

    callback({
      outputFields: {
        pickupLines,
        deliveryLines,
      },
    });
  } catch (error) {
    console.error('Error sending agent interaction:', error.message);

    await logErrorToDatadog({
      message: 'Error sending agent interaction',
      recordId,
      quoteId,
      contactId,
      error,
    });

    callback({
      outputFields: {
        error: error.message,
      },
    });
  }
}

exports.main = execute;
