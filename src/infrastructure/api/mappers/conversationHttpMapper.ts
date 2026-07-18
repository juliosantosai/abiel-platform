function toConversationControlDto(result) {
  if (!result) {
    return result;
  }

  if (typeof result.toJSON === "function") {
    return result.toJSON();
  }

  return { ...result };
}

module.exports = { toConversationControlDto };
