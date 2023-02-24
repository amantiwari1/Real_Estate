/* eslint-disable @typescript-eslint/no-explicit-any */
function getPropertyFromString<T>(
  propertyString: string,
  data: T
): T[keyof T] | undefined {
  const properties = propertyString.split(".");
  let value: T[keyof T] | undefined = data[properties[0] as keyof T];
  for (let i = 1; i < properties.length; i++) {
    if (value == null) {
      break;
    }
    value = (value as any)[properties[i] as keyof typeof value];
  }
  return value;
}

export default getPropertyFromString;
