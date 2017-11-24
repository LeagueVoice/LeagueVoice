
function getUserId(assistant) {
  let user = assistant.getUser();
  let userId = user && user.userId;
  assistant.ask(userId
    ? `Your user ID is ${userId}.`
    : 'I cannot determine your user ID.');
}

module.exports = {
  getUserId
};
