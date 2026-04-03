import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export function Form({ children, onSubmit, methods }) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="on">
        {children}
      </form>
    </RHFForm>
  );
}
