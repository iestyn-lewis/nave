# Nave - a small library for state-based Javascript applications

## State
Nave is based around The State.  
## State
Nave is based around The State.  The state is a single Javascript object that contains everything about your application, including data, settings, user preferences – everything.  
## Setting
State can only be set as a single entity – you cannot set a single piece of the application state directly.  The usual workflow is:
•	Request a copy of the application’s current state from Nave.  (In practice, we often use Actions, which get state passed to them so you do not need to explicitly request it – more on that later).
•	Make changes to that state copy, either on your own, or with Paths and Moderators, which are helpers that you can register with Nave.
•	Send the whole state back to Nave, and Nave will notify all components.
## Installation
To enable Nave, include the Nave.js file in your HTML page.  
