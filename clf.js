
// FIRST:
// Install clarifai to your project.
// From your project's root directory, run the following command:

// npm install clarifai --save

// Then paste the below boilerplate code near the top of your file
// just below your import statements.
// Make sure replace 'YOUR_API_KEY' with your actual API Key.


const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'ca20e667d4d14e19b7e666cc050de384'
});
process.nextTick = setImmediate;