export const isEmailValid = (email: string) => {
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicPattern.test(email)) {
    return false;
  }

  const domainPart = email.split("@")[1];

  if (!domainPart.includes(".")) {
    return false;
  }

  const domainParts = domainPart.split(".");
  const topLevelDomain = domainParts.pop();
  const secondLevelDomain = domainParts.pop();

  if (
    (topLevelDomain && topLevelDomain.length <= 2) ||
    secondLevelDomain === "test"
  ) {
    return false;
  }

  return true;
};
