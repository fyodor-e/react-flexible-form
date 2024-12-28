/* eslint-disable @typescript-eslint/no-explicit-any */
export const appendErrors = ({
  name,
  validateAllFieldCriteria,
  errors,
  type,
  message,
}: {
  name: any;
  validateAllFieldCriteria: boolean;
  errors: any;
  type: string | undefined;
  message: any;
}) => {
  if (!validateAllFieldCriteria) return {};
  if (!type) return errors[name];

  return {
    ...errors[name],
    types: {
      ...((errors[name] && errors[name]!.types) ?? {}),
      [type]: message || true,
    },
  };
};
