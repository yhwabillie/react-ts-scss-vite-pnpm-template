import React, { useEffect, useRef } from 'react';
import styles from './Pipeline.module.scss';
import BackgroundCallout from './BackgroundCallout';
import clsx from 'clsx';

// 개별 스테이지 카드 컴포넌트
interface StageProps {
  num: string;
  title: string;
  children: React.ReactNode;
  effect: string;
}

const PipelineStage = ({ num, title, children, effect }: StageProps) => {
  return (
    <section className={styles['pipeline-stage']}>
      <h3 className={clsx(styles['pipeline-stage__header'], 'pipeline-stage__header-gsap')}>
        Stage {num}: {title}
      </h3>

      <div className={clsx(styles['pipeline-stage__effect'], 'pipeline-stage__effor-gsap')}>
        <BackgroundCallout
          type='info'
          standalone={true}
          label={`🛠️ ${effect}`}
          margin='0 0 8px 0'
        />
      </div>
      {children}
    </section>
  );
};

export default PipelineStage;
