class InjectionError extends Error {
  constructor(name: string) {
    super(`${name} is/are not injected.`);
  }
}

export default InjectionError;
