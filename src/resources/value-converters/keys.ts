export class KeysValueConverter {
  toView(value: Object) {
    if (value) {
      return Reflect.ownKeys(value);
    }

    return undefined;
  }
}
