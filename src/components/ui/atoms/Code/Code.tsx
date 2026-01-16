import Styles from '@/components/ui/atoms/Code/Code.module.scss';

interface CodeProps {
  children: string;
}

const Code = ({ children }: CodeProps) => {
  return <code className={Styles['code']}>{children}</code>;
};

export default Code;
