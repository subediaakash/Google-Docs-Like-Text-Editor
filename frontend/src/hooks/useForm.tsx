import { useState, ChangeEvent, FormEvent } from "react";

export function useForm<T>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit =
    (onSubmit: (data: T) => void) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(formData);
    };

  return { formData, handleChange, handleSubmit };
}
