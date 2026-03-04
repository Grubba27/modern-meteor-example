## Meteor Discovery

This package provides a simple way to discover all the Meteor methods that are available in an application.
It exposes a single endpoint at `/discovery` that returns a JSON object containing the names of all the Meteor methods and their corresponding parameter names.

This also adds validation to our methods.

> At the moment this only works with Meteor methods, but in the future it will also support publications!

## Usage

You have to add the `createDiscoveryPage` function to your server startup code.

You can also pass a custom validator function to it(at the moment only `meteor/check` is supported),
which will be used to validate the incoming requests to methods and used to document those methods.

```js
import { Meteor } from "meteor/meteor";
import { createDiscoveryPage } from "/imports/api/meteor-discovery";
import { check } from "meteor/check";

Meteor.startup(() => {
  createDiscoveryPage({
    validator: check
  });
});
```

Now you can access the discovery page at `http://localhost:3000/discovery` and see all documented methods and their parameters.

### Documenting methods

Installing this package does not automatically document all your methods,
you have to explicitly document them by using `this.addDescription` and `this.validate` methods

See it in action in the [example app](https://github.com/Grubba27/modern-meteor-example/blob/46c9de40767c2b106fde0cdcebc18d0e853a49dc/server/main.js#L64-L84)

```js
import { Meteor } from "meteor/meteor";

Meteor.methods({
  "links.insert": function () {
    this.addDescription("Inserts a new link with the given title and url");
    const { title, url } = this.validate({
      title: String,
      url: String
    });
    // ... rest of the method implementation
  }
});
```

### Up next

- [] Support for publications
- [] One method for both description and validation (`this.onInvocation("description").expects(type).returns({type})` or something like that)
- [] Build time documentation generation
- [] Support for custom validators
- [] Custom endpoint for discovery page and custom formats (e.g. OpenAPI)
- [] Custom collection name
