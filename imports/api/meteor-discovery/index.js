import { WebApp } from "meteor/webapp";
import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

class DiscoveryCall extends Error {
  constructor(message) {
    super(message);
    this.name = "DiscoveryCall";
  }
}

/**
 * {methodName: string, description: string, discoverable: boolean, schema: object}
 */
const DiscoveryCollection = new Mongo.Collection("discovery");

global.DiscoveryCollection = DiscoveryCollection; // for debugging purposes
global.dropDiscoveryCollection = async () => {
  await DiscoveryCollection.removeAsync({});
};
DiscoveryCollection.createIndexAsync({ methodName: 1 }, { unique: true });

function addDescription(text) {
  console.log(`Description for ${this.name}: ${text}`);
  this.discoverable = true;
  // add to collection that is used to render the discovery page, unique by method name
  DiscoveryCollection.upsertAsync(
    { methodName: this.name },
    { $set: { description: text, discoverable: true } }
  );
}

const makeKeyTypeForCheck = (key, schema) => {
  if (schema[key].name) {
    return schema[key].name;
  } else if (schema[key].constructor && schema[key].constructor.name) {
    const possibleType = schema[key].constructor.name;

    if (possibleType && schema[key].pattern.name) {
      return `${possibleType}(${schema[key].pattern.name})`;
    }

    return possibleType;
  } else {
    return "Unknown";
  }
};

function validate({ schema, validator }) {
  if (this.__is_discovering_call__ && this.discoverable) {
    const obj = Object.keys(schema).reduce((acc, key) => {
      acc[key] = makeKeyTypeForCheck(key, schema);
      return acc;
    }, {});
    DiscoveryCollection.upsertAsync(
      { methodName: this.name },
      { $set: { schema: obj } }
    );
    throw new DiscoveryCall(
      "This is a discovery call, not executing the method"
    );
  }

  // decide if args are valid or not
  // at first is just one arg but we can extend it to support multiple args in the future

  const passedValues = this.__args[0];

  for (const key in schema) {
    const kind = schema[key];
    const value = passedValues[key];

    // validator should throw if the validation fails, we can catch it and add more info about the method that is being called
    validator(value, kind);
  }

  return passedValues;
}

export async function createDiscoveryPage(
  { validator } = { validator: args => true }
) {
  await DiscoveryCollection.removeAsync({});

  Object.keys(Meteor.server.method_handlers).forEach(methodName => {
    const originalHandler = Meteor.server.method_handlers[methodName];
    Meteor.server.method_handlers[methodName] = function (...args) {
      this.name = methodName;
      this.__args = args;

      this.discoverable = false;

      this.addDescription = text => addDescription.call(this, text);
      this.validate = schema => validate.call(this, { schema, validator });
      return originalHandler.apply(this, args);
    };
  });

  WebApp.connectHandlers.use("/discovery", async (req, res, next) => {
    Object.keys(Meteor.server.method_handlers).reduce((acc, methodName) => {
      const originalHandler = Meteor.server.method_handlers[methodName];
      try {
        // we can call the method with a special context that indicates that we are discovering the method and we can add more info to the context if needed
        originalHandler.call({ __is_discovering_call__: true, __args: [] }, {});
      } catch (e) {
        if (e instanceof DiscoveryCall) {
          // do nothing, this is expected
        } else {
          console.log(
            `Error checking if method ${methodName} is discoverable:`,
            e
          );
        }
      }
      return acc;
    }, {});

    const methods = await DiscoveryCollection.find(
      { discoverable: true },
      {
        fields: { _id: 0, methodName: 1, description: 1, schema: 1 }
      }
    ).fetchAsync();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ methods }));
  });
}
