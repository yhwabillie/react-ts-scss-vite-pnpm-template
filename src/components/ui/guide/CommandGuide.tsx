import type { ReactNode } from 'react';
import Style from './CommandGuide.module.scss';

interface CommandGuideProps {
  title?: string;
  children?: ReactNode;
}

const CommandGuide = ({ title, children }: CommandGuideProps) => {
  return (
    <section id='start' className={Style['command-guide']}>
      <h2 className='command-guide__title'>{title}</h2>

      {children}
    </section>
  );
};

export default CommandGuide;
