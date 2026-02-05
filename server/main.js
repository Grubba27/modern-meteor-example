import { Meteor } from "meteor/meteor";
import { LinksCollection } from "/imports/api/links";
import { Random } from "meteor/random";
import fetch from 'node-fetch';

async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if ((await LinksCollection.find().countAsync()) === 0) {
    await insertLink({
      title: "Do the Tutorial",
      url: "https://docs.meteor.com/tutorials/react/",
    });

    await insertLink({
      title: "Follow the Guide",
      url: "https://docs.meteor.com/tutorials/application-structure/",
    });

    await insertLink({
      title: "Read the Docs",
      url: "https://docs.meteor.com",
    });

    await insertLink({
      title: "Discussions",
      url: "https://forums.meteor.com",
    });

    await insertLink({
      title: "Join us on Discord",
      url: "https://discord.gg/6mS3wHNg",
    });

    await insertLink({
      title: "Deploying in Galaxy",
      url: "https://www.meteor.com/hosting",
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });

  // example of server-side fetch usage
  const response = await fetch('https://www.githubstatus.com/api/v2/summary.json');
  const data = await response.json();
  console.log('GitHub status:', data.status.description);


  console.time("startup");

  console.log("Before defer Dev");
  Meteor.deferDev(async () => {
    console.log("Connecting to some external service...");
    console.log("This will run later on local mode!");
  })
  console.log("After defer Dev");

  console.log("Before defer Prod");
  Meteor.deferProd(async () => {
    console.log("Connecting to some service...");
    console.log("This will run later on prod mode!");
  })
  console.log("After defer Prod");

  // in a regular meteor run
  // Before defer Dev
  // After defer Dev
  // Before defer Prod
  // Connecting to some service...
  // This will run later on prod mode!
  // After defer Prod
  // Connecting to some external service...
  // This will run later on local mode!

  // in a meteor run --production
  // Before defer Dev
  // Connecting to some external service...
  // This will run later on local mode!
  // After defer Dev
  // Before defer Prod
  // After defer Prod
  // Connecting to some service...
  // This will run later on prod mode!


  const value = Meteor.deferDev(() => "deferDev") || Meteor.deferProd(() => "deferProd");
  console.log("Deferred value will be set to:", value);

  // You can also use Meteor.deferrable
  const currentMode = Meteor.deferrable(() => "we are in dev mode", { on: ["dev", "test"]}) || Meteor.deferrable(() => "we are in prod mode", { on: ["production"]});
  console.log( currentMode);

  // You can also pass functions too!
  const connectToExternalExpensiveService = async () => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    console.log("Connecting to external expensive service...");
    await sleep(Math.random() * 2000 + 1000); // simulate expensive connection
    console.log("Connected to external expensive service!");
  }

  await Meteor.deferDev(connectToExternalExpensiveService);

  console.timeEnd("startup");
});

Meteor.methods({
  about() {
    return `This is a Meteor application running React with React Router. this is a generated id: ${Random.id()}`;
  },
});
