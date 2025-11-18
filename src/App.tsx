import Button from '@/components/ui/atoms/Button/Button';
import Icon from '@/components/ui/atoms/Icon/Icon';

function App() {
  return (
    <>
      <Button color='primary' size='xs' variant='solid' shape='square'>
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
      <Button color='brand-sub' size='xl' variant='outline' shape='pill'>
        Brand Button
      </Button>

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
