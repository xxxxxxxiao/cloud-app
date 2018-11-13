// Give success or failure responses

// Return status code 200 and the newly created item
export function success(body) {
    return buildResponse(200, body);
  }
  
// Return status code 500 on error
export function failure(body) {
    return buildResponse(500, body);
}

// Set response headers to enable CORS (Cross-Origin Resource Sharing)
function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(body)
    };
}