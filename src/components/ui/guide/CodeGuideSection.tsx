import { type ReactNode } from 'react';
import Style from './CodeGuideSection.module.scss';

interface CodeGuideSectionProps {
  title?: string;
  children?: ReactNode;
}

const CodeGuideSection = ({ title, children }: CodeGuideSectionProps) => {
  return (
    <section className={Style['code-guide-section']}>
      <h2 className='code-guide-section__title'>{title}</h2>
      {children}
    </section>
  );
};

export default CodeGuideSection;
