/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormStateReturn,
  useFormContext,
} from 'react-hook-form';

export function withController<
  TComponentProps extends { onChange?: (...events: any[]) => void } & Record<
    string,
    any
  >, //eslint-disable-line
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  BaseComponent:
    | React.ForwardRefExoticComponent<TComponentProps>
    | ((props: TComponentProps) => JSX.Element),
  mapper?: ({
    field,
    fieldState,
    formState,
    props,
  }: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
    props: TComponentProps;
  }) => Partial<TComponentProps>
) {
  function ControlledInput({
    name,
    ...props
  }: TComponentProps & { name: TName }) {
    const { control, ...form } = useFormContext<TFieldValues>();
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState, formState }) => {
          const mappedProps = mapper?.({
            field,
            fieldState,
            formState,
            props: props as any,
          }); //eslint-disable-line

          const handleChange = (...values: any) => {
            //eslint-disable-line
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            props?.onChange?.(...values);
            field.onChange(...values);
          };

          const handleBlur = () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            props.onBlur?.();
            field.onBlur();
          };

          const mapped = {
            onChange: handleChange,
            error:
              (fieldState.error && Array.isArray(fieldState.error)
                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  fieldState.error[0]?.message
                : fieldState.error?.message) ?? props.error,
            value: field.value ?? '',
            onBlur: handleBlur,
            placeholder:
              props.placeholder ??
              (typeof props.label === 'string' ? props.label : undefined),
            ...mappedProps,
          };

          // TODO - instead of passing reset prop, find a way to pass an onReset handler
          return (
            <BaseComponent
              {...(props as TComponentProps & { name: TName })}
              {...mapped}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              reset={(form as any)?.resetCount}
            />
          );
        }}
      />
    );
  }
  return ControlledInput;
}
