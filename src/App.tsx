import Button from '@/components/ui/molecules/Button/Button';
import Icon from '@/components/ui/atoms/Icon/Icon';
import LinkButton from './components/ui/molecules/Button/LinkButton';
import IconButton from './components/ui/molecules/IconButton/IconButton';
import IconLinkButton from './components/ui/molecules/IconButton/IconLinkButton';

function App() {
  // 타입 정의
  type DisplayLevel = 'd1' | 'd2' | 'd3';
  type HeadingLevel = 'h1' | 'h2' | 'h3';
  type SubtitleLevel = 'st1' | 'st2' | 'st3';
  type BodyLevel = 'b1' | 'b2' | 'b3';
  type CaptionLevel = 'c1' | 'c2' | 'c3';
  type ButtonLevel = 'btn1' | 'btn2' | 'btn3';

  // Display 레벨
  const displayStyles: Record<DisplayLevel, React.CSSProperties> = {
    d1: { font: 'var(--project-typo-d1-700)' },
    d2: { font: 'var(--project-typo-d2-700)' },
    d3: { font: 'var(--project-typo-d3-700)' },
  };

  // Heading 레벨
  const headingStyles: Record<HeadingLevel, React.CSSProperties> = {
    h1: { font: 'var(--project-typo-h1-700)' },
    h2: { font: 'var(--project-typo-h2-700)' },
    h3: { font: 'var(--project-typo-h3-700)' },
  };

  // Subtitle 레벨
  const subtitleStyles: Record<SubtitleLevel, React.CSSProperties> = {
    st1: { font: 'var(--project-typo-st1-500)' },
    st2: { font: 'var(--project-typo-st2-500)' },
    st3: { font: 'var(--project-typo-st3-400)' },
  };

  // Body 레벨
  const bodyStyles: Record<BodyLevel, React.CSSProperties> = {
    b1: { font: 'var(--project-typo-b1-400)' },
    b2: { font: 'var(--project-typo-b2-400)' },
    b3: { font: 'var(--project-typo-b3-400)' },
  };

  // Caption 레벨
  const captionStyles: Record<CaptionLevel, React.CSSProperties> = {
    c1: { font: 'var(--project-typo-c1-400)' },
    c2: { font: 'var(--project-typo-c2-400)' },
    c3: { font: 'var(--project-typo-c3-400)' },
  };

  // Button 레벨
  const btnStyles: Record<ButtonLevel, React.CSSProperties> = {
    btn1: { font: 'var(--project-typo-btn1-500)' },
    btn2: { font: 'var(--project-typo-btn2-600)' },
    btn3: { font: 'var(--project-typo-btn3-400)' },
  };

  return (
    <>
      <section>
        <div>
          <IconLinkButton
            color='brand'
            size='xl'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
            href='#'
            target='_blank'
            title='새 창 열기'
          />
          <IconLinkButton
            color='brand'
            size='lg'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
            href='#'
            target='_blank'
            title='새 창 열기'
          />
          <IconLinkButton
            color='brand'
            size='md'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
            href='#'
            target='_blank'
            title='새 창 열기'
          />
          <IconLinkButton
            color='brand'
            size='sm'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
            href='#'
            target='_blank'
            title='새 창 열기'
          />
          <IconLinkButton
            color='brand'
            size='xs'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
            href='#'
            target='_blank'
            title='새 창 열기'
          />
        </div>
      </section>
      <section>
        <div>
          <IconButton
            color='brand'
            size='xl'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='lg'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='md'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='sm'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='xs'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
        </div>
        <div>
          <IconButton
            color='brand'
            size='xl'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='lg'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='md'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='sm'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='xs'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
          />
        </div>
        <div>
          <IconButton
            color='brand'
            size='xl'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
            disabled
          />
          <IconButton
            color='brand'
            size='lg'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
            disabled
          />
          <IconButton
            color='brand'
            size='md'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
            disabled
          />
          <IconButton
            color='brand'
            size='sm'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
            disabled
          />
          <IconButton
            color='brand'
            size='xs'
            variant='outline'
            shape='pill'
            icon={<Icon name='logout' />}
            disabled
          />
        </div>
        <div>
          <IconButton
            color='brand'
            size='xl'
            variant='soft'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='lg'
            variant='soft'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='md'
            variant='soft'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='sm'
            variant='soft'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='xs'
            variant='soft'
            shape='pill'
            icon={<Icon name='logout' />}
          />
        </div>
        <div>
          <IconButton
            color='brand'
            size='xl'
            variant='ghost'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='lg'
            variant='ghost'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='md'
            variant='ghost'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='sm'
            variant='ghost'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand'
            size='xs'
            variant='ghost'
            shape='pill'
            icon={<Icon name='logout' />}
          />
        </div>
        <div>
          <IconButton
            color='brand-sub'
            size='xl'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand-sub'
            size='lg'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand-sub'
            size='md'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand-sub'
            size='sm'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='brand-sub'
            size='xs'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
        </div>
        <div>
          <IconButton
            color='primary'
            size='xl'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='primary'
            size='lg'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='primary'
            size='md'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='primary'
            size='sm'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='primary'
            size='xs'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
        </div>
        <div>
          <IconButton
            color='secondary'
            size='xl'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='secondary'
            size='lg'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='secondary'
            size='md'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='secondary'
            size='sm'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='secondary'
            size='xs'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
        </div>
        <div>
          <IconButton
            color='tertiary'
            size='xl'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='tertiary'
            size='lg'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='tertiary'
            size='md'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='tertiary'
            size='sm'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
          <IconButton
            color='tertiary'
            size='xs'
            variant='solid'
            shape='pill'
            icon={<Icon name='logout' />}
          />
        </div>
      </section>
      <section>
        <div>
          <LinkButton
            color='primary'
            size='xl'
            variant='link'
            shape='rounded'
            href='#'
            endIcon={<Icon name='logout' />}
          >
            링크 Text 버튼
          </LinkButton>
          <LinkButton
            color='primary'
            size='lg'
            variant='link'
            shape='rounded'
            href='#'
            endIcon={<Icon name='logout' />}
          >
            링크 Text 버튼
          </LinkButton>
          <LinkButton
            color='primary'
            size='md'
            variant='link'
            shape='rounded'
            href='#'
            endIcon={<Icon name='logout' />}
          >
            링크 Text 버튼
          </LinkButton>
          <LinkButton
            color='primary'
            size='sm'
            variant='link'
            shape='rounded'
            href='#'
            endIcon={<Icon name='logout' />}
          >
            링크 Text 버튼
          </LinkButton>
          <LinkButton
            color='primary'
            size='xs'
            variant='link'
            shape='rounded'
            href='#'
            endIcon={<Icon name='logout' />}
          >
            링크 Text 버튼
          </LinkButton>
        </div>
        <div>
          <LinkButton color='secondary' size='xl' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='secondary' size='lg' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='secondary' size='md' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='secondary' size='sm' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='secondary' size='xs' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
        </div>
        <div>
          <LinkButton color='tertiary' size='xl' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='tertiary' size='lg' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='tertiary' size='md' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='tertiary' size='sm' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='tertiary' size='xs' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
        </div>
        <div>
          <LinkButton color='brand' size='xl' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='brand' size='lg' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='brand' size='md' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='brand' size='sm' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='brand' size='xs' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
        </div>
        <div>
          <LinkButton color='brand-sub' size='xl' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='brand-sub' size='lg' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='brand-sub' size='md' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='brand-sub' size='sm' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='brand-sub' size='xs' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
        </div>
        <div>
          <LinkButton color='success' size='xl' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='success' size='lg' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='success' size='md' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='success' size='sm' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='success' size='xs' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
        </div>
        <div>
          <LinkButton color='warning' size='xl' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='warning' size='lg' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='warning' size='md' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='warning' size='sm' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='warning' size='xs' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
        </div>
        <div>
          <LinkButton color='danger' size='xl' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='danger' size='lg' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='danger' size='md' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='danger' size='sm' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
          <LinkButton color='danger' size='xs' variant='link' shape='rounded' href='#'>
            링크 Text 버튼
          </LinkButton>
        </div>
        <div>
          <LinkButton
            color='danger'
            size='xl'
            variant='link'
            shape='rounded'
            href='#'
            aria-disabled
          >
            링크 Text 버튼
          </LinkButton>
          <LinkButton
            color='danger'
            size='lg'
            variant='link'
            shape='rounded'
            href='#'
            aria-disabled
          >
            링크 Text 버튼
          </LinkButton>
          <LinkButton
            color='danger'
            size='md'
            variant='link'
            shape='rounded'
            href='#'
            aria-disabled
          >
            링크 Text 버튼
          </LinkButton>
          <LinkButton
            color='danger'
            size='sm'
            variant='link'
            shape='rounded'
            href='#'
            aria-disabled
          >
            링크 Text 버튼
          </LinkButton>
          <LinkButton
            color='danger'
            size='xs'
            variant='link'
            shape='rounded'
            href='#'
            aria-disabled
          >
            링크 Text 버튼
          </LinkButton>
        </div>
      </section>
      <section>
        <div>
          <LinkButton
            color='brand'
            size='xl'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
            href='/home'
            title='새 창 열기'
            target='_blank'
            aria-disabled
          >
            링크 버튼
          </LinkButton>
        </div>
      </section>
      <section>
        <div>
          <Button
            color='brand'
            size='xl'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
          >
            Brand XL 버튼
          </Button>
          <Button
            color='brand'
            size='lg'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
          >
            Brand LG 버튼
          </Button>
          <Button
            color='brand'
            size='md'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
          >
            Brand MD 버튼
          </Button>
          <Button
            color='brand'
            size='sm'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
          >
            Brand SM 버튼
          </Button>
          <Button
            color='brand'
            size='xs'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
          >
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button
            color='brand'
            size='xl'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
            disabled
          >
            Brand XL 버튼
          </Button>
          <Button
            color='brand'
            size='lg'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
            disabled
          >
            Brand LG 버튼
          </Button>
          <Button
            color='brand'
            size='md'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
            disabled
          >
            Brand MD 버튼
          </Button>
          <Button
            color='brand'
            size='sm'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
            disabled
          >
            Brand SM 버튼
          </Button>
          <Button
            color='brand'
            size='xs'
            variant='solid'
            shape='rounded'
            endIcon={<Icon name='logout' />}
            disabled
          >
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand' size='xl' variant='solid' shape='rounded'>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='lg' variant='solid' shape='rounded'>
            Brand LG 버튼
          </Button>
          <Button color='brand' size='md' variant='solid' shape='rounded'>
            Brand MD 버튼
          </Button>
          <Button color='brand' size='sm' variant='solid' shape='rounded'>
            Brand SM 버튼
          </Button>
          <Button color='brand' size='xs' variant='solid' shape='rounded'>
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand' size='xl' variant='solid' shape='rounded' disabled>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='lg' variant='solid' shape='rounded' disabled>
            Brand LG 버튼
          </Button>
          <Button color='brand' size='md' variant='solid' shape='rounded' disabled>
            Brand MD 버튼
          </Button>
          <Button color='brand' size='sm' variant='solid' shape='rounded' disabled>
            Brand SM 버튼
          </Button>
          <Button color='brand' size='xs' variant='solid' shape='rounded' disabled>
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand' size='xl' variant='outline' shape='rounded'>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='lg' variant='outline' shape='rounded'>
            Brand LG 버튼
          </Button>
          <Button color='brand' size='md' variant='outline' shape='rounded'>
            Brand MD 버튼
          </Button>
          <Button color='brand' size='sm' variant='outline' shape='rounded'>
            Brand SM 버튼
          </Button>
          <Button color='brand' size='xs' variant='outline' shape='rounded'>
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand' size='xl' variant='outline' shape='rounded' disabled>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='lg' variant='outline' shape='rounded' disabled>
            Brand LG 버튼
          </Button>
          <Button color='brand' size='md' variant='outline' shape='rounded' disabled>
            Brand MD 버튼
          </Button>
          <Button color='brand' size='sm' variant='outline' shape='rounded' disabled>
            Brand SM 버튼
          </Button>
          <Button color='brand' size='xs' variant='outline' shape='rounded' disabled>
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand' size='xl' variant='soft' shape='rounded'>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='lg' variant='soft' shape='rounded'>
            Brand LG 버튼
          </Button>
          <Button color='brand' size='md' variant='soft' shape='rounded'>
            Brand MD 버튼
          </Button>
          <Button color='brand' size='sm' variant='soft' shape='rounded'>
            Brand SM 버튼
          </Button>
          <Button color='brand' size='xs' variant='soft' shape='rounded'>
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand' size='xl' variant='soft' shape='rounded' disabled>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='lg' variant='soft' shape='rounded' disabled>
            Brand LG 버튼
          </Button>
          <Button color='brand' size='md' variant='soft' shape='rounded' disabled>
            Brand MD 버튼
          </Button>
          <Button color='brand' size='sm' variant='soft' shape='rounded' disabled>
            Brand SM 버튼
          </Button>
          <Button color='brand' size='xs' variant='soft' shape='rounded' disabled>
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand' size='xl' variant='ghost' shape='rounded'>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='lg' variant='ghost' shape='rounded'>
            Brand LG 버튼
          </Button>
          <Button color='brand' size='md' variant='ghost' shape='rounded'>
            Brand MD 버튼
          </Button>
          <Button color='brand' size='sm' variant='ghost' shape='rounded'>
            Brand SM 버튼
          </Button>
          <Button color='brand' size='xs' variant='ghost' shape='rounded'>
            Brand XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand' size='xl' variant='ghost' shape='rounded' disabled>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='lg' variant='ghost' shape='rounded' disabled>
            Brand LG 버튼
          </Button>
          <Button color='brand' size='md' variant='ghost' shape='rounded' disabled>
            Brand MD 버튼
          </Button>
          <Button color='brand' size='sm' variant='ghost' shape='rounded' disabled>
            Brand SM 버튼
          </Button>
          <Button color='brand' size='xs' variant='ghost' shape='rounded' disabled>
            Brand XS 버튼
          </Button>
        </div>
      </section>
      <section>
        <div>
          <Button color='brand-sub' size='xl' variant='solid' shape='rounded'>
            Brand Sub XL 버튼
          </Button>
          <Button color='brand-sub' size='lg' variant='solid' shape='rounded'>
            Brand Sub LG 버튼
          </Button>
          <Button color='brand-sub' size='md' variant='solid' shape='rounded'>
            Brand Sub MD 버튼
          </Button>
          <Button color='brand-sub' size='sm' variant='solid' shape='rounded'>
            Brand Sub SM 버튼
          </Button>
          <Button color='brand-sub' size='xs' variant='solid' shape='rounded'>
            Brand Sub XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand-sub' size='xl' variant='outline' shape='rounded'>
            Brand Sub XL 버튼
          </Button>
          <Button color='brand-sub' size='lg' variant='outline' shape='rounded'>
            Brand Sub LG 버튼
          </Button>
          <Button color='brand-sub' size='md' variant='outline' shape='rounded'>
            Brand Sub MD 버튼
          </Button>
          <Button color='brand-sub' size='sm' variant='outline' shape='rounded'>
            Brand Sub SM 버튼
          </Button>
          <Button color='brand-sub' size='xs' variant='outline' shape='rounded'>
            Brand Sub XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand-sub' size='xl' variant='soft' shape='rounded'>
            Brand Sub XL 버튼
          </Button>
          <Button color='brand-sub' size='lg' variant='soft' shape='rounded'>
            Brand Sub LG 버튼
          </Button>
          <Button color='brand-sub' size='md' variant='soft' shape='rounded'>
            Brand Sub MD 버튼
          </Button>
          <Button color='brand-sub' size='sm' variant='soft' shape='rounded'>
            Brand Sub SM 버튼
          </Button>
          <Button color='brand-sub' size='xs' variant='soft' shape='rounded'>
            Brand Sub XS 버튼
          </Button>
        </div>
        <div>
          <Button color='brand-sub' size='xl' variant='ghost' shape='rounded'>
            Brand Sub XL 버튼
          </Button>
          <Button color='brand-sub' size='lg' variant='ghost' shape='rounded'>
            Brand Sub LG 버튼
          </Button>
          <Button color='brand-sub' size='md' variant='ghost' shape='rounded'>
            Brand Sub MD 버튼
          </Button>
          <Button color='brand-sub' size='sm' variant='ghost' shape='rounded'>
            Brand Sub SM 버튼
          </Button>
          <Button color='brand-sub' size='xs' variant='ghost' shape='rounded'>
            Brand Sub XS 버튼
          </Button>
        </div>
      </section>
      <section>
        <div>
          <Button color='primary' size='xl' variant='solid' shape='rounded'>
            Primary XL 버튼
          </Button>
          <Button color='primary' size='lg' variant='solid' shape='rounded'>
            Primary LG 버튼
          </Button>
          <Button color='primary' size='md' variant='solid' shape='rounded'>
            Primary MD 버튼
          </Button>
          <Button color='primary' size='sm' variant='solid' shape='rounded'>
            Primary SM 버튼
          </Button>
          <Button color='primary' size='xs' variant='solid' shape='rounded'>
            Primary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='primary' size='xl' variant='outline' shape='rounded'>
            Primary XL 버튼
          </Button>
          <Button color='primary' size='lg' variant='outline' shape='rounded'>
            Primary LG 버튼
          </Button>
          <Button color='primary' size='md' variant='outline' shape='rounded'>
            Primary MD 버튼
          </Button>
          <Button color='primary' size='sm' variant='outline' shape='rounded'>
            Primary SM 버튼
          </Button>
          <Button color='primary' size='xs' variant='outline' shape='rounded'>
            Primary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='primary' size='xl' variant='soft' shape='rounded'>
            Primary XL 버튼
          </Button>
          <Button color='primary' size='lg' variant='soft' shape='rounded'>
            Primary LG 버튼
          </Button>
          <Button color='primary' size='md' variant='soft' shape='rounded'>
            Primary MD 버튼
          </Button>
          <Button color='primary' size='sm' variant='soft' shape='rounded'>
            Primary SM 버튼
          </Button>
          <Button color='primary' size='xs' variant='soft' shape='rounded'>
            Primary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='primary' size='xl' variant='ghost' shape='rounded'>
            Primary XL 버튼
          </Button>
          <Button color='primary' size='lg' variant='ghost' shape='rounded'>
            Primary LG 버튼
          </Button>
          <Button color='primary' size='md' variant='ghost' shape='rounded'>
            Primary MD 버튼
          </Button>
          <Button color='primary' size='sm' variant='ghost' shape='rounded'>
            Primary SM 버튼
          </Button>
          <Button color='primary' size='xs' variant='ghost' shape='rounded'>
            Primary XS 버튼
          </Button>
        </div>
      </section>
      <section>
        <div>
          <Button color='secondary' size='xl' variant='solid' shape='rounded'>
            Secondary XL 버튼
          </Button>
          <Button color='secondary' size='lg' variant='solid' shape='rounded'>
            Secondary LG 버튼
          </Button>
          <Button color='secondary' size='md' variant='solid' shape='rounded'>
            Secondary MD 버튼
          </Button>
          <Button color='secondary' size='sm' variant='solid' shape='rounded'>
            Secondary SM 버튼
          </Button>
          <Button color='secondary' size='xs' variant='solid' shape='rounded'>
            Secondary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='secondary' size='xl' variant='outline' shape='rounded'>
            Secondary XL 버튼
          </Button>
          <Button color='secondary' size='lg' variant='outline' shape='rounded'>
            Secondary LG 버튼
          </Button>
          <Button color='secondary' size='md' variant='outline' shape='rounded'>
            Secondary MD 버튼
          </Button>
          <Button color='secondary' size='sm' variant='outline' shape='rounded'>
            Secondary SM 버튼
          </Button>
          <Button color='secondary' size='xs' variant='outline' shape='rounded'>
            Secondary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='secondary' size='xl' variant='soft' shape='rounded'>
            Secondary XL 버튼
          </Button>
          <Button color='secondary' size='lg' variant='soft' shape='rounded'>
            Secondary LG 버튼
          </Button>
          <Button color='secondary' size='md' variant='soft' shape='rounded'>
            Secondary MD 버튼
          </Button>
          <Button color='secondary' size='sm' variant='soft' shape='rounded'>
            Secondary SM 버튼
          </Button>
          <Button color='secondary' size='xs' variant='soft' shape='rounded'>
            Secondary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='secondary' size='xl' variant='ghost' shape='rounded'>
            Secondary XL 버튼
          </Button>
          <Button color='secondary' size='lg' variant='ghost' shape='rounded'>
            Secondary LG 버튼
          </Button>
          <Button color='secondary' size='md' variant='ghost' shape='rounded'>
            Secondary MD 버튼
          </Button>
          <Button color='secondary' size='sm' variant='ghost' shape='rounded'>
            Secondary SM 버튼
          </Button>
          <Button color='secondary' size='xs' variant='ghost' shape='rounded'>
            Secondary XS 버튼
          </Button>
        </div>
      </section>
      <section>
        <div>
          <Button color='tertiary' size='xl' variant='solid' shape='rounded'>
            Tertiary XL 버튼
          </Button>
          <Button color='tertiary' size='lg' variant='solid' shape='rounded'>
            Tertiary LG 버튼
          </Button>
          <Button color='tertiary' size='md' variant='solid' shape='rounded'>
            Tertiary MD 버튼
          </Button>
          <Button color='tertiary' size='sm' variant='solid' shape='rounded'>
            Tertiary SM 버튼
          </Button>
          <Button color='tertiary' size='xs' variant='solid' shape='rounded'>
            Tertiary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='tertiary' size='xl' variant='outline' shape='rounded'>
            Tertiary XL 버튼
          </Button>
          <Button color='tertiary' size='lg' variant='outline' shape='rounded'>
            Tertiary LG 버튼
          </Button>
          <Button color='tertiary' size='md' variant='outline' shape='rounded'>
            Tertiary MD 버튼
          </Button>
          <Button color='tertiary' size='sm' variant='outline' shape='rounded'>
            Tertiary SM 버튼
          </Button>
          <Button color='tertiary' size='xs' variant='outline' shape='rounded'>
            Tertiary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='tertiary' size='xl' variant='soft' shape='rounded'>
            Tertiary XL 버튼
          </Button>
          <Button color='tertiary' size='lg' variant='soft' shape='rounded'>
            Tertiary LG 버튼
          </Button>
          <Button color='tertiary' size='md' variant='soft' shape='rounded'>
            Tertiary MD 버튼
          </Button>
          <Button color='tertiary' size='sm' variant='soft' shape='rounded'>
            Tertiary SM 버튼
          </Button>
          <Button color='tertiary' size='xs' variant='soft' shape='rounded'>
            Tertiary XS 버튼
          </Button>
        </div>
        <div>
          <Button color='tertiary' size='xl' variant='ghost' shape='rounded'>
            Tertiary XL 버튼
          </Button>
          <Button color='tertiary' size='lg' variant='ghost' shape='rounded'>
            Tertiary LG 버튼
          </Button>
          <Button color='tertiary' size='md' variant='ghost' shape='rounded'>
            Tertiary MD 버튼
          </Button>
          <Button color='tertiary' size='sm' variant='ghost' shape='rounded'>
            Tertiary SM 버튼
          </Button>
          <Button color='tertiary' size='xs' variant='ghost' shape='rounded'>
            Tertiary XS 버튼
          </Button>
        </div>
      </section>

      <section>
        <div>
          <Button color='success' size='xl' variant='solid' shape='rounded'>
            Success XL 버튼
          </Button>
          <Button color='success' size='lg' variant='solid' shape='rounded'>
            Success LG 버튼
          </Button>
          <Button color='success' size='md' variant='solid' shape='rounded'>
            Success MD 버튼
          </Button>
          <Button color='success' size='sm' variant='solid' shape='rounded'>
            Success SM 버튼
          </Button>
          <Button color='success' size='xs' variant='solid' shape='rounded'>
            Success XS 버튼
          </Button>
        </div>
        <div>
          <Button color='success' size='xl' variant='outline' shape='rounded'>
            Success XL 버튼
          </Button>
          <Button color='success' size='lg' variant='outline' shape='rounded'>
            Success LG 버튼
          </Button>
          <Button color='success' size='md' variant='outline' shape='rounded'>
            Success MD 버튼
          </Button>
          <Button color='success' size='sm' variant='outline' shape='rounded'>
            Success SM 버튼
          </Button>
          <Button color='success' size='xs' variant='outline' shape='rounded'>
            Success XS 버튼
          </Button>
        </div>
        <div>
          <Button color='success' size='xl' variant='soft' shape='rounded'>
            Success XL 버튼
          </Button>
          <Button color='success' size='lg' variant='soft' shape='rounded'>
            Success LG 버튼
          </Button>
          <Button color='success' size='md' variant='soft' shape='rounded'>
            Success MD 버튼
          </Button>
          <Button color='success' size='sm' variant='soft' shape='rounded'>
            Success SM 버튼
          </Button>
          <Button color='success' size='xs' variant='soft' shape='rounded'>
            Success XS 버튼
          </Button>
        </div>
        <div>
          <Button color='success' size='xl' variant='ghost' shape='rounded'>
            Success XL 버튼
          </Button>
          <Button color='success' size='lg' variant='ghost' shape='rounded'>
            Success LG 버튼
          </Button>
          <Button color='success' size='md' variant='ghost' shape='rounded'>
            Success MD 버튼
          </Button>
          <Button color='success' size='sm' variant='ghost' shape='rounded'>
            Success SM 버튼
          </Button>
          <Button color='success' size='xs' variant='ghost' shape='rounded'>
            Success XS 버튼
          </Button>
        </div>
      </section>
      <section>
        <div>
          <Button color='warning' size='xl' variant='solid' shape='rounded'>
            Warning XL 버튼
          </Button>
          <Button color='warning' size='lg' variant='solid' shape='rounded'>
            Warning LG 버튼
          </Button>
          <Button color='warning' size='md' variant='solid' shape='rounded'>
            Warning MD 버튼
          </Button>
          <Button color='warning' size='sm' variant='solid' shape='rounded'>
            Warning SM 버튼
          </Button>
          <Button color='warning' size='xs' variant='solid' shape='rounded'>
            Warning XS 버튼
          </Button>
        </div>
        <div>
          <Button color='warning' size='xl' variant='outline' shape='rounded'>
            Warning XL 버튼
          </Button>
          <Button color='warning' size='lg' variant='outline' shape='rounded'>
            Warning LG 버튼
          </Button>
          <Button color='warning' size='md' variant='outline' shape='rounded'>
            Warning MD 버튼
          </Button>
          <Button color='warning' size='sm' variant='outline' shape='rounded'>
            Warning SM 버튼
          </Button>
          <Button color='warning' size='xs' variant='outline' shape='rounded'>
            Warning XS 버튼
          </Button>
        </div>
        <div>
          <Button color='warning' size='xl' variant='soft' shape='rounded'>
            Warning XL 버튼
          </Button>
          <Button color='warning' size='lg' variant='soft' shape='rounded'>
            Warning LG 버튼
          </Button>
          <Button color='warning' size='md' variant='soft' shape='rounded'>
            Warning MD 버튼
          </Button>
          <Button color='warning' size='sm' variant='soft' shape='rounded'>
            Warning SM 버튼
          </Button>
          <Button color='warning' size='xs' variant='soft' shape='rounded'>
            Warning XS 버튼
          </Button>
        </div>
        <div>
          <Button color='warning' size='xl' variant='ghost' shape='rounded'>
            Warning XL 버튼
          </Button>
          <Button color='warning' size='lg' variant='ghost' shape='rounded'>
            Warning LG 버튼
          </Button>
          <Button color='warning' size='md' variant='ghost' shape='rounded'>
            Warning MD 버튼
          </Button>
          <Button color='warning' size='sm' variant='ghost' shape='rounded'>
            Warning SM 버튼
          </Button>
          <Button color='warning' size='xs' variant='ghost' shape='rounded'>
            Warning XS 버튼
          </Button>
        </div>
      </section>
      <section>
        <div>
          <Button color='danger' size='xl' variant='solid' shape='rounded'>
            Danger XL 버튼
          </Button>
          <Button color='danger' size='lg' variant='solid' shape='rounded'>
            Danger LG 버튼
          </Button>
          <Button color='danger' size='md' variant='solid' shape='rounded'>
            Danger MD 버튼
          </Button>
          <Button color='danger' size='sm' variant='solid' shape='rounded'>
            Danger SM 버튼
          </Button>
          <Button color='danger' size='xs' variant='solid' shape='rounded'>
            Danger XS 버튼
          </Button>
        </div>
        <div>
          <Button color='danger' size='xl' variant='outline' shape='rounded'>
            Danger XL 버튼
          </Button>
          <Button color='danger' size='lg' variant='outline' shape='rounded'>
            Danger LG 버튼
          </Button>
          <Button color='danger' size='md' variant='outline' shape='rounded'>
            Danger MD 버튼
          </Button>
          <Button color='danger' size='sm' variant='outline' shape='rounded'>
            Danger SM 버튼
          </Button>
          <Button color='danger' size='xs' variant='outline' shape='rounded'>
            Danger XS 버튼
          </Button>
        </div>
        <div>
          <Button color='danger' size='xl' variant='soft' shape='rounded'>
            Danger XL 버튼
          </Button>
          <Button color='danger' size='lg' variant='soft' shape='rounded'>
            Danger LG 버튼
          </Button>
          <Button color='danger' size='md' variant='soft' shape='rounded'>
            Danger MD 버튼
          </Button>
          <Button color='danger' size='sm' variant='soft' shape='rounded'>
            Danger SM 버튼
          </Button>
          <Button color='danger' size='xs' variant='soft' shape='rounded'>
            Danger XS 버튼
          </Button>
        </div>
        <div>
          <Button color='danger' size='xl' variant='ghost' shape='rounded'>
            Danger XL 버튼
          </Button>
          <Button color='danger' size='lg' variant='ghost' shape='rounded'>
            Danger LG 버튼
          </Button>
          <Button color='danger' size='md' variant='ghost' shape='rounded'>
            Danger MD 버튼
          </Button>
          <Button color='danger' size='sm' variant='ghost' shape='rounded'>
            Danger SM 버튼
          </Button>
          <Button color='danger' size='xs' variant='ghost' shape='rounded'>
            Danger XS 버튼
          </Button>
        </div>
      </section>

      {/* <IconButton
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
      <Icon name='logout' color='blue' size='lg' /> */}

      <section>
        {/* Display */}
        <h1 style={displayStyles.d1}>
          Display는 화면에서 가장 큰 텍스트로 주로 마케팅 용도로 사용한다 — abc 0123456789 @#%!?*
        </h1>
        <h1 style={displayStyles.d1}>
          ブランドの印象を強く打ち出すための大胆なディスプレイ書体です — abc 0123456789 @#%!?*
        </h1>

        <h2 style={displayStyles.d2}>
          화면의 첫 시선을 잡기 위한 비주얼 중심 타이포그래피입니다 — abc 0123456789 @#%!?*
        </h2>
        <h2 style={displayStyles.d2}>
          画面の視線を一瞬で惹きつけるための大きな文字設計です — abc 0123456789 @#%!?*
        </h2>

        <h3 style={displayStyles.d3}>
          메시지의 분위기와 무드를 강조하는 대형 서체 구성입니다 — abc 0123456789 @#%!?*
        </h3>
        <h3 style={displayStyles.d3}>
          メッセージの雰囲気を強調し、印象づけるための見出しです — abc 0123456789 @#%!?*
        </h3>
      </section>

      <section>
        {/* Heading */}
        <h1 style={headingStyles.h1}>
          페이지 구조의 최상위 제목으로 핵심 정보를 명확히 전달합니다 — abc 0123456789 @#%!?*
        </h1>
        <h1 style={headingStyles.h1}>
          ページ構造の最上位タイトルとして重要情報を明確に示します — abc 0123456789 @#%!?*
        </h1>

        <h2 style={headingStyles.h2}>
          섹션을 구분하고 사용자가 내용을 쉽게 파악하도록 돕는 제목 스타일입니다 — abc 0123456789
          @#%!?*
        </h2>
        <h2 style={headingStyles.h2}>
          セクションを整理し、読み手の理解を助けるための見出しです — abc 0123456789 @#%!?*
        </h2>

        <h3 style={headingStyles.h3}>
          세부 콘텐츠를 안내하는 구조적·정보 중심의 소제목입니다 — abc 0123456789 @#%!?*
        </h3>
        <h3 style={headingStyles.h3}>
          詳細コンテンツを整理し、情報を階層的に伝える小見出しです — abc 0123456789 @#%!?*
        </h3>
      </section>

      <section>
        {/* Subtitle */}
        <h4 style={subtitleStyles.st1}>
          주요 메시지 보조 설명으로 사용되는 중간 크기 서체입니다 — abc 0123456789 @#%!?*
        </h4>
        <h4 style={subtitleStyles.st1}>
          主要メッセージを補足する中くらいのサイズの書体です — abc 0123456789 @#%!?*
        </h4>

        <h4 style={subtitleStyles.st2}>
          부제목, 설명 등 콘텐츠 흐름을 안내하는 서체입니다 — abc 0123456789 @#%!?*
        </h4>
        <h4 style={subtitleStyles.st2}>
          サブタイトルや説明文としてコンテンツの流れを案内する書体です — abc 0123456789 @#%!?*
        </h4>

        <h4 style={subtitleStyles.st3}>
          상세 설명, 작은 안내 문구에 사용되는 서체입니다 — abc 0123456789 @#%!?*
        </h4>
        <h4 style={subtitleStyles.st3}>
          詳細説明や小さな案内文に使用される書体です — abc 0123456789 @#%!?*
        </h4>
      </section>

      <section>
        {/* Body */}
        <p style={bodyStyles.b1}>
          본문 내용 전달용 표준 크기 텍스트로 가독성을 높입니다 — abc 0123456789 @#%!?*
        </p>
        <p style={bodyStyles.b1}>
          本文内容を伝える標準サイズのテキストで可読性を高めます — abc 0123456789 @#%!?*
        </p>

        <p style={bodyStyles.b2}>
          일반 문단, 보조 설명 등 중간 크기 텍스트에 사용됩니다 — abc 0123456789 @#%!?*
        </p>
        <p style={bodyStyles.b2}>
          一般段落や補足説明など、中くらいのサイズのテキストに使用されます — abc 0123456789 @#%!?*
        </p>

        <p style={bodyStyles.b3}>
          작은 문단, 미세 설명, UI 안내 텍스트 등 가독성 위주 사용 — abc 0123456789 @#%!?*
        </p>
        <p style={bodyStyles.b3}>
          小さな段落や微細な説明、UI案内テキストなど可読性重視で使用 — abc 0123456789 @#%!?*
        </p>
      </section>

      <section>
        {/* Caption */}
        <span style={captionStyles.c1}>
          보조 정보, 라벨, 참고 텍스트 등 작은 글자용 서체입니다 — abc 0123456789 @#%!?*
        </span>
        <span style={captionStyles.c1}>
          補助情報やラベル、参考テキストなど小さい文字用書体です — abc 0123456789 @#%!?*
        </span>

        <span style={captionStyles.c2}>
          UI 라벨, 부가 설명 등 아주 작은 글자용 서체 — abc 0123456789 @#%!?*
        </span>
        <span style={captionStyles.c2}>
          UIラベルや補助説明など非常に小さい文字用書体 — abc 0123456789 @#%!?*
        </span>

        <span style={captionStyles.c3}>
          최하위 참고, 알림, 작은 안내 문구 등 — abc 0123456789 @#%!?*
        </span>
        <span style={captionStyles.c3}>
          最下位の参考情報、通知や小さな案内文など — abc 0123456789 @#%!?*
        </span>
      </section>

      <section>
        {/* Button */}
        <button style={btnStyles.btn1}>기본 버튼 텍스트 — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn1}>基本ボタンテキスト — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn2}>강조 버튼 텍스트 — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn2}>強調ボタンテキスト — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn3}>보조 버튼 텍스트 — abc 0123456789 @#%!?*</button>
        <button style={btnStyles.btn3}>補助ボタンテキスト — abc 0123456789 @#%!?*</button>
      </section>
    </>
  );
}

export default App;
