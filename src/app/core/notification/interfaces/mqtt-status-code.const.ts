export const mqttStatusCodes = {
  ok: { errorCode: 0, errorMessage: 'AMQJSC0000I OK' },
  socketClosed: { errorCode: 8, errorMessage: 'AMQJS0008I Socket closed.' }
};

    //   To be validated for Paho and used as needed
    //   The following connect codes come from mqttws.js
    //      OK: {code:0, text:"AMQJSC0000I OK."},
    //      CONNECT_TIMEOUT: {code:1, text:"AMQJSC0001E Connect timed out."},
    //      SUBSCRIBE_TIMEOUT: {code:2, text:"AMQJS0002E Subscribe timed out."},
    //      UNSUBSCRIBE_TIMEOUT: {code:3, text:"AMQJS0003E Unsubscribe timed out."},
    //      PING_TIMEOUT: {code:4, text:"AMQJS0004E Ping timed out."},
    //      INTERNAL_ERROR: {code:5, text:"AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"},
    //      CONNACK_RETURNCODE: {code:6, text:"AMQJS0006E Bad Connack return code:{0} {1}."},
    //      SOCKET_ERROR: {code:7, text:"AMQJS0007E Socket error:{0}."},
    //      SOCKET_CLOSE: {code:8, text:"AMQJS0008I Socket closed."},
    //      MALFORMED_UTF: {code:9, text:"AMQJS0009E Malformed UTF data:{0} {1} {2}."},
    //      UNSUPPORTED: {code:10, text:"AMQJS0010E {0} is not supported by this browser."},
    //      INVALID_STATE: {code:11, text:"AMQJS0011E Invalid state {0}."},
    //      INVALID_TYPE: {code:12, text:"AMQJS0012E Invalid type {0} for {1}."},
    //      INVALID_ARGUMENT: {code:13, text:"AMQJS0013E Invalid argument {0} for {1}."},
    //      UNSUPPORTED_OPERATION: {code:14, text:"AMQJS0014E Unsupported operation."},
    //      INVALID_STORED_DATA: {code:15, text:"AMQJS0015E Invalid data in local storage key={0} value={1}."},
    //      INVALID_MQTT_MESSAGE_TYPE: {code:16, text:"AMQJS0016E Invalid MQTT message type {0}."},
    //      MALFORMED_UNICODE: {code:17, text:"AMQJS0017E Malformed Unicode string:{0} {1}."},
