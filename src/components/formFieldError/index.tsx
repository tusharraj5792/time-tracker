interface propsType {
  message: string;
}

const FormFieldError = ({ message }: propsType) => {
  return (
    <span className='text-danger d-flex item-center error-txt'>
      <img src='./error.svg' />
      <span>{message}</span>
    </span>
  );
};

export default FormFieldError;
