interface IErrorMessageProps {
  error: string;
}

export const ErrorMessage = (props: IErrorMessageProps) => (
  <p className="text-black">{props.error}</p>
);
