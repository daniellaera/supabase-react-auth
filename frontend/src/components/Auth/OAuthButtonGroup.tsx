import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react';
import { GitHubIcon, GoogleIcon, TwitterIcon } from './ProviderIcons';

const providers = [
  { name: 'GitHub', icon: <GitHubIcon boxSize="5" /> },
  { name: 'Google', icon: <GoogleIcon boxSize="5" /> },
  { name: 'Twitter', icon: <TwitterIcon boxSize="5" /> }
];

interface Props {
  childToParent(socialName: string): any;
}

export const OAuthButtonGroup = ({ childToParent }: Props) => {

  function signInWithSocial(name: string): void {
    childToParent(name);
  }

  return (
    <ButtonGroup variant="outline" spacing="4" width="full">
      {providers.map(({ name, icon }, i: number) => (
        <Button key={i} width="full" onClick={() => signInWithSocial(name)}>
          <VisuallyHidden>Sign in with {name}</VisuallyHidden>
          {icon}
        </Button>
      ))}
    </ButtonGroup>
  );
};
