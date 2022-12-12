const { App } = require('@slack/bolt');

import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, PORT } from './constants.js'
import { exec } from 'child_process';

import home_json from '../ui/home.json';
import actions_json from '../ui/actions.json';
import running_json from '../ui/running.json';
import terminal_json from '../ui/terminal.json';

// Initializes yourx app with your bot token and signing secret
const app = new App({
    token: SLACK_BOT_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
    port: PORT || 3000
});
  
(async () => {
    // Start your app
    await app.start();
  
    console.log('⚡️ Core Commands app is running!');
})();


// Listens to incoming messages that contain "core"
app.message('core', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
        blocks : [
          actions_json
        ]
      });
});


app.action('ps', async ({ body, ack, say }) => {
    // Acknowledge the action

    await ack();
    await say(
       getRunningUI('ps')
    );

    const channelId = body.channel.id;
    let {stdout} = await executeAsyncCommand(`sh shell/ps.sh`);
    
    await say({
        blocks: [
          getTerminalText(stdout)  
        ]
    })
});

app.action('clean', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    getRunningUI('clean')
  );

  let {stdout, stderr} = await executeAsyncCommand('sh shell/build.sh clean');

  await say({
    blocks: [
        getTerminalText(stdout)
    ]
  })
});


app.action('pre', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    await say(
      getRunningUI('pre')
    );

    let {stdout, stderr} = await executeAsyncCommand('sh shell/build.sh pre');

    await say({
      blocks: [
          getTerminalText(stdout)
      ]
    })
});

app.action('compile', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    getRunningUI('compile')
  );

  let {stdout, stderr} = await executeAsyncCommand('sh shell/build.sh compile');

  await say({
    blocks: [
        getTerminalText(stdout)
    ]
  })
});


app.action('post', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    getRunningUI('post')
  );

  let {stdout, stderr} = await executeAsyncCommand('sh shell/build.sh post');

  await say({
    blocks: [
        getTerminalText(stdout)
    ]
  })
});


app.action('plsql', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    getRunningUI('plsql')
  );

  let {stdout, stderr} = await executeAsyncCommand('sh shell/build.sh plsql');

  await say({
    blocks: [
        getTerminalText(stdout)
    ]
  })
});


app.action('build', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    getRunningUI('build')
  );

  let {stdout, stderr} = await executeAsyncCommand('sh shell/build.sh');

  await say({
    blocks: [
        getTerminalText(stdout)
    ]
  })
});


app.action('start', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    getRunningUI('start')
  );

  let {stdout, stderr} = await executeAsyncCommand('sh shell/start.sh');

  await say({
    blocks: [
        getTerminalText(stdout)
    ]
  })
});


app.action('sync', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(
    getRunningUI('sync')
  );

  let {stdout, stderr} = await executeAsyncCommand('sh shell/sync.sh');

  await say({
    blocks: [
        getTerminalText(stdout)
    ]
  })
});


// Listen for users opening your App Home
app.event('app_home_opened', async ({ event, client, logger }) => {
    try {
      // Call views.publish with the built-in client
      const result = await client.views.publish({
        // Use the user ID associated with the event
        user_id: event.user,
        view: {
          // Home tabs must be enabled in your app configuration page under "App Home"
          "type": "home",
          "blocks": home_json.blocks
        }
      });
  
      logger.info(result);
    }
    catch (error) {
      logger.error(error);
    }
});



  

/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function executeAsyncCommand(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject({ err });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}


function getRunningUI(step) {
  let section = Object.assign({},running_json);
  section.blocks[1].text.text = "---- Running " + `${step} ${new Date().toTimeString().split(" ")[0]} ----`;
  return section;
}


function getTerminalText(stdout) {
  let section = Object.assign({},terminal_json);
  section.text.text = stdout;
  return section;
}