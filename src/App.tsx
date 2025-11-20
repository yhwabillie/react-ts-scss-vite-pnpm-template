import Button from '@/components/ui/molecules/Button/Button';
import Icon from '@/components/ui/atoms/Icon/Icon';
import LinkButton from './components/ui/molecules/Button/LinkButton';
import IconButton from './components/ui/molecules/IconButton/IconButton';
import IconLinkButton from './components/ui/molecules/IconButton/IconLinkButton';

function App() {
  return (
    <>
      <Button color='primary' size='xs' variant='solid' shape='square' disabled={true}>
        Primary Button
      </Button>
      <Button color='secondary' size='sm' variant='solid' shape='rounded'>
        Secondary Button
      </Button>
      <Button color='tertiary' size='md' variant='solid' shape='rounded'>
        Tertiary Button
      </Button>
      <Button color='brand' size='lg' variant='solid' shape='rounded'>
        Brand Button
      </Button>
      <Button
        color='brand-sub'
        size='xl'
        variant='outline'
        shape='pill'
        endIcon={<Icon name='logout' color='red' size='md' />}
        onClick={() => console.log('Clicked!')}
      >
        Brand Button
      </Button>

      <LinkButton
        href='/home'
        title='새 창 열기'
        target='_blank'
        variant='outline'
        color='secondary'
        size='xl'
        shape='square'
        startIcon={<Icon name='logout' color='red' size='md' />}
        aria-disabled='true'
      >
        링크
      </LinkButton>

      <IconButton
        color='secondary'
        size='xl'
        variant='solid'
        shape='pill'
        icon={<Icon name='logout' color='red' size='md' />}
      />
      <IconButton
        color='primary'
        size='lg'
        variant='solid'
        shape='pill'
        icon={<Icon name='logout' color='red' size='md' />}
      />
      <IconLinkButton
        href='/home'
        title='새 창 열기'
        target='_blank'
        color='secondary'
        size='lg'
        variant='outline'
        shape='pill'
        icon={<Icon name='logout' color='red' size='md' />}
        aria-disabled='true'
      />

      <Icon name='search' color='red' size='sm' />
      <Icon name='search' color='red' size='md' />
      <Icon name='search' color='blue' size='lg' />

      <Icon name='logout' color='red' size='sm' />
      <Icon name='logout' color='red' size='md' />
      <Icon name='logout' color='blue' size='lg' />
    </>
  );
}

export default App;
