var SensorTag = require('sensortag');
var format = require('util').format;
var sensorTag;
function onDiscover(st) {
  sensorTag = st;
  console.log('got a sensortag: %s', sensorTag);
  sensorTag.connect(onConnect);
}
function onConnect(err) {
  if (err) {
    return console.error('couldnt connect to %s', sensorTag, err);
  }
  console.log('connected to %s, now discovering services...', sensorTag);
  sensorTag.discoverServicesAndCharacteristics(onDiscoverServices);
}

function onDiscoverServices() {
  console.log('discovered all characteristics for %s', sensorTag);
  
  enableServices();
  //sensorTag.enableIrTemperature(onEnabledTemperature);
}
function enableServices() {
  var services = [
    'irTemperature',
    'accelerometer',
    'humidity'
  ];
  services.forEach(function(service) {
    var method = service.charAt(0).toUpperCase() + service.slice(1);
    var enable = 'enable' + method;
    var fn = function() {
      console.log('new value for %s', service, [].slice.call(arguments));
    };
    sensorTag[enable](function(err) {
      if (err) {
        return console.warn('Couldnt enable: %s', service, err);
      }
      var notify = 'notify' + method;
      var change = service + 'Change';
      
      
      sensorTag[notify](function() {
        console.log('we\'ll be notified of %s', service);
      });
      console.log('listening to %s', change);
      sensorTag.on(change, fn);
    });
    
  });
}
/*function onEnabledTemperature(err) {
  if (err) {
    return console.error('cannot enable ir temperature', err);
  }

  sensorTag.on('irTemperatureChange', onTemperatureChange);
  sensorTag.notifyIrTemperature(function() {
    console.log('we will be notified of temperature change');
  });
}

function onTemperatureChange(object, ambient) {
  process.stdout.write(format(
    'Object Temperature: %s°C\tAmbient Temperature: %s°C\r',
    (object).toFixed(2),
    (ambient).toFixed(2)
  ));
}*/
SensorTag.discover(onDiscover);