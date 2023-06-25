import { useMutation } from '@tanstack/react-query';

const URL = 'https://app.convertkit.com/forms/3997673/subscriptions';

function postData(data: FormData) {
  return fetch(URL, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const useOnboardingSubscriber = () => {
  const { mutate, ...rest } = useMutation(postData);

  const onSubscribe = ({ email, name }: { email: string; name: string }) => {
    const formData = new FormData();
    formData.append('email_address', email);
    formData.append('fields[first_name]', name);
    formData.append('user', 'd506b01f-b95b-4c4e-945e-f35dfa9f6a9d');
    mutate(formData);
  };

  return { onSubscribe, ...rest };
};
