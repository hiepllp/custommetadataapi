({
    doInit: function(component, event, helper) {
        var action = component.get("c.getSessionId");
        action.setCallback(this, function(response) {
        
            // Configure CometD
            var sessionId = response.getReturnValue();
            var cometd = new window.org.cometd.CometD();
            cometd.configure({
                url: window.location.protocol + '//' + window.location.hostname + '/cometd/40.0/',
                requestHeaders: { Authorization: 'OAuth ' + sessionId},
                appendMessageTypeToURL : false
            });

            // Connect to 
            cometd.handshake($A.getCallback(function(status) {
                if (status.successful) {
                    var eventName = component.get("v.channel");
                    cometd.subscribe(eventName, $A.getCallback(function(message) {
                            var messageEvent = component.getEvent("messageReceived");
                            messageEvent.setParam("payload", message.data.payload);
                            messageEvent.fire();
                        }
                    ));
                } else {
                    // TODO: Handle errors 
                    console.log(status);
                }
            }));

        });
        $A.enqueueAction(action);
    }
})