export type SelectObject = {
  [key: string]: boolean | SelectObject;
};

export function convertToSelectObject(fields?: string[]): SelectObject {
  if (!fields?.length) return;

  const select = {};

  fields.forEach((field) => {
    const hasValue = field.includes(':');
    const value = hasValue ? JSON.parse(field.split(':').at(-1)) : true;
    field = hasValue ? field.replace(/:[a-z]*$/, '') : field;

    const subFields = field.split('.');

    if (subFields.length <= 1) {
      select[subFields[0]] = value;
      return;
    }

    let lastField = select;
    subFields.forEach((subField, i) => {
      const isLast = i === subFields.length - 1;
      lastField[subField] = isLast ? value : {};
      lastField = lastField[subField];
    });
  }, {});

  return select;
}
