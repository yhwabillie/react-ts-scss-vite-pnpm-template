import Button from '@/components/ui/molecules/Button/Button';
import Icon from '@/components/ui/atoms/Icon/Icon';
import LinkButton from '@/components/ui/molecules/Button/LinkButton';
import IconButton from '@/components/ui/molecules/IconButton/IconButton';
import IconLinkButton from '@/components/ui/molecules/IconButton/IconLinkButton';
import RingSpinner from '@/components/ui/atoms/Spinner/LoadingSpinner/RingSpinner';
import Radio from '@/components/ui/atoms/Radio/Radio';
import Checkbox from '@/components/ui/atoms/Checkbox/Checkbox';
import Label from './components/ui/atoms/Label/Label';
import FormField from './components/ui/molecules/FormField/FormField';
import ButtonGroup from './components/ui/molecules/ButtonGroup/ButtonGroup';
import ActionBar from './components/ui/organisms/ActionBar/ActionBar';
import FormFieldset from './components/ui/molecules/FormFieldset/FormFieldset';
import ValidationMsg from './components/ui/atoms/ValidationMsg/ValidationMsg';
import ControlGroup from './components/ui/molecules/ControlGroup/ControlGroup';
import Switch from './components/ui/molecules/Switch/Switch';
import Input from './components/ui/atoms/Input/Input';
import Textarea from './components/ui/atoms/Textarea/Textarea';
import OptionItem, { type OptionItemProps } from './components/ui/molecules/OptionItem/OptionItem';
import OptionList from './components/ui/molecules/OptionList/OptionList';
import Selectbox from './components/ui/molecules/Selectbox/Selectbox';
import { useEffect, useState } from 'react';
import OptionListPortal from './components/ui/molecules/OptionListPortal/OptionListPortal';
import Combobox from './components/ui/molecules/Combobox/Combobox';

// 타입 정의
type DisplayLevel = 'd1' | 'd2' | 'd3';
type HeadingLevel = 'h1' | 'h2' | 'h3';
type SubtitleLevel = 'st1' | 'st2' | 'st3';
type BodyLevel = 'b1' | 'b2' | 'b3';
type CaptionLevel = 'c1' | 'c2' | 'c3';
type LabelLevel = 'l1' | 'l2' | 'l3';
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

// Label 레벨
const labelStyles: Record<LabelLevel, React.CSSProperties> = {
  l1: { font: 'var(--project-typo-l1-500)' },
  l2: { font: 'var(--project-typo-l2-500)' },
  l3: { font: 'var(--project-typo-l3-500)' },
};

// Button 레벨
const btnStyles: Record<ButtonLevel, React.CSSProperties> = {
  btn1: { font: 'var(--project-typo-btn1-500)' },
  btn2: { font: 'var(--project-typo-btn2-600)' },
  btn3: { font: 'var(--project-typo-btn3-400)' },
};

type Option = {
  id: string;
  value: string;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
};

// -------------------------------
// 1번 Selectbox 데이터
// -------------------------------
const mockOptions1: Option[] = [
  {
    id: 'placeholder',
    label: 'Select 아이템을 선택해 주세요',
    value: '',
    selected: false,
    disabled: true,
  },
  { id: 'opt-1', value: '옵션 1' },
  { id: 'opt-2', value: '옵션 2' },
  { id: 'opt-3', value: '옵션 3' },
  { id: 'opt-4', value: '옵션 4' },
  { id: 'opt-5', value: '옵션 5' },
  { id: 'opt-6', value: '옵션 6' },
  { id: 'opt-7', value: '옵션 7' },
  { id: 'opt-8', value: '옵션 8' },
  { id: 'opt-9', value: '옵션 9' },
];

const placeholderOption1: Option = mockOptions1[0];

const parsedOptions1: Option[] = [
  ...(mockOptions1.some(opt => opt.id === 'placeholder') ? [placeholderOption1] : []),
  ...mockOptions1.filter(opt => opt.value !== ''),
];

// 초기 선택 id를 기준으로
const initialSelectedId1 = parsedOptions1.find(opt => opt.selected)?.id ?? parsedOptions1[0].id;

// -------------------------------
// 2번 Combobox 데이터
// -------------------------------
type Option2 = {
  id: string;
  value: string;
  label?: string;
  selected: boolean;
  disabled: boolean;
};

const mockOptions2: Option2[] = [
  {
    id: 'placeholder',
    value: '',
    label: 'Combo 아이템을 선택해 주세요',
    selected: false,
    disabled: true,
  },
  { id: 'combo-1', value: '바나나', selected: false, disabled: false },
  { id: 'combo-2', value: '사과', selected: false, disabled: false },
  { id: 'combo-3', value: '파인애플', selected: false, disabled: false },
  { id: 'combo-4', value: '나주배', selected: false, disabled: false },
  { id: 'combo-5', value: '용과', selected: false, disabled: false },
  { id: 'combo-6', value: '샤인머스캣', selected: false, disabled: false },
  { id: 'combo-7', value: '딸기', selected: false, disabled: false },
  { id: 'combo-8', value: '망고', selected: false, disabled: true },
  { id: 'combo-9', value: '키위', selected: false, disabled: true },
];

const placeholderOption2: Option2 = mockOptions2[0];

const parsedOptions2: Option2[] = [
  ...(mockOptions2.some(opt => opt.id === 'placeholder') ? [placeholderOption2] : []),
  ...mockOptions2.filter(opt => opt.value !== ''),
];

// 초기 선택 id를 기준으로
const initialSelectedId2 = parsedOptions2.find(opt => opt.selected)?.id ?? parsedOptions2[0].id;

function App() {
  // id 기준으로 선택된 value 가져오기
  const [selectedId1, setSelectedId1] = useState(initialSelectedId1);
  const selectedValue1 = parsedOptions1.find(opt => opt.id === selectedId1)?.value ?? '';

  const [selectedId2, setSelectedId2] = useState(initialSelectedId2);
  const selectedValue2 = parsedOptions2.find(opt => opt.id === selectedId2)?.value ?? '';

  return (
    <>
      <section style={{ width: '700px', margin: '30px auto 30px auto' }}>
        <label id='combobox-1-label' htmlFor='combobox-1'>
          옵션 카테고리
        </label>
        <Combobox
          variant='outline'
          color='primary'
          size='xl'
          id='combobox-1'
          ariaControls='combobox-1-optionlist'
          ariaLabelledBy='combobox-1-label'
          value={selectedValue2}
          placeholder={mockOptions2[0].label}
          onValueChange={val => {
            // value로 바로 상태를 바꾸는게 아니라 id 기준으로 바꿔야 함
            const found = parsedOptions2.find(opt => opt.value === val);
            if (found) setSelectedId2(found.id);
          }}
        >
          <OptionList
            id='combobox-1-optionlist'
            variant='outline'
            color='primary'
            size='xl'
            selectedId={selectedId2}
            onOptionSelect={id => {
              setSelectedId2(id);
            }}
          >
            {parsedOptions2.map((opt, idx) => (
              <OptionItem
                key={opt.id}
                variant='ghost'
                color='primary'
                size='xl'
                index={idx}
                id={opt.id}
                value={opt.value}
                placeholder={opt.label}
                selected={selectedId2 === opt.id}
                aria-disabled={opt.disabled}
              />
            ))}
          </OptionList>
        </Combobox>
      </section>

      <section style={{ width: '700px', margin: 'auto' }}>
        <label id='selectbox-1-label' htmlFor='custom-select-1'>
          옵션 카테고리
        </label>
        <Selectbox
          variant='outline'
          color='warning'
          size='xl'
          id='custom-select-1'
          ariaControls='selectbox-1-optionlist'
          ariaLabelledBy='selectbox-1-label'
          value={selectedValue1}
          placeholder={mockOptions1[0].label}
          onValueChange={val => {
            // value로 바로 상태를 바꾸는게 아니라 id 기준으로 바꿔야 함
            const found = parsedOptions1.find(opt => opt.value === val);
            if (found) setSelectedId1(found.id);
          }}
        >
          <OptionList
            id='selectbox-1-optionlist'
            variant='outline'
            color='warning'
            size='xl'
            selectedId={selectedId1}
            onOptionSelect={id => {
              setSelectedId1(id); // id 선택
            }}
          >
            {parsedOptions1.map((opt, idx) => (
              <OptionItem
                key={opt.id}
                variant='ghost'
                color='warning'
                size='xl'
                index={idx}
                id={opt.id}
                value={opt.value}
                placeholder={opt.label}
                selected={selectedId1 === opt.id}
                aria-disabled={opt.disabled}
              />
            ))}
          </OptionList>
        </Selectbox>
      </section>

      <section style={{ margin: '30px' }}>
        <Textarea
          variant='solid'
          color='primary'
          id='textarea-r-1'
          rows={6}
          placeholder='입력하세요'
        />
        <Textarea
          variant='outline'
          color='primary'
          id='textarea-r-2'
          rows={6}
          placeholder='입력하세요'
        />
        <Textarea
          variant='soft'
          color='primary'
          id='textarea-r-3'
          rows={6}
          placeholder='입력하세요'
        />
        <Textarea
          variant='ghost'
          color='primary'
          id='textarea-r-4'
          rows={6}
          placeholder='입력하세요'
        />

        <Textarea
          variant='solid'
          color='primary'
          id='textarea-1'
          rows={6}
          placeholder='입력하세요'
          defaultValue='비활성화 textarea 텍스트'
          disabled
        />
        <Textarea
          variant='outline'
          color='primary'
          id='textarea-2'
          rows={6}
          placeholder='입력하세요'
          defaultValue='비활성화 textarea 텍스트'
          disabled
        />
        <Textarea
          variant='soft'
          color='primary'
          id='textarea-3'
          rows={6}
          placeholder='입력하세요'
          defaultValue='비활성화 textarea 텍스트'
          disabled
        />
        <Textarea
          variant='ghost'
          color='primary'
          id='textarea-4'
          rows={6}
          placeholder='입력하세요'
          defaultValue='비활성화 textarea 텍스트'
          disabled
        />
      </section>
      <section style={{ margin: '30px' }}>
        <Input
          as='div'
          id='input-icon-1'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='xl'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='비활성화'
          disabled
          adornedEnd={
            <IconButton
              color='tertiary'
              size='xl'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
              disabled
            />
          }
        />
        <Input
          as='div'
          id='input-icon-2'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='lg'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='읽기만 가능'
          readOnly
          adornedEnd={
            <IconButton
              color='tertiary'
              size='lg'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-icon-3'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='md'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              as='div'
              color='tertiary'
              size='md'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-icon-4'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='sm'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              color='tertiary'
              size='sm'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-icon-5'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='xs'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              color='tertiary'
              size='xs'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
      </section>
      <section style={{ margin: '30px' }}>
        <Input
          as='div'
          id='input-outline-1'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='xl'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='비활성화'
          disabled
        />
        <Input
          as='div'
          id='input-outline-2'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='lg'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='읽기만 가능'
          readOnly
        />
        <Input
          as='div'
          id='input-outline-3'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='md'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
        <Input
          as='div'
          id='input-outline-4'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='sm'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
        <Input
          as='div'
          id='input-outline-5'
          type='text'
          shape='rounded'
          variant='outline'
          color='tertiary'
          size='xs'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
      </section>
      <section style={{ margin: '30px' }}>
        <Input
          as='div'
          id='input-solid-1'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='xl'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='비활성화'
          disabled
          adornedEnd={
            <IconButton
              color='tertiary'
              size='xl'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
              disabled
            />
          }
        />
        <Input
          as='div'
          id='input-solid-2'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='lg'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='읽기만 가능'
          readOnly
          adornedEnd={
            <IconButton
              color='tertiary'
              size='lg'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-solid-3'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='md'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              as='div'
              color='tertiary'
              size='md'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-solid-4'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='sm'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              color='tertiary'
              size='sm'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
        <Input
          as='div'
          id='input-solid-5'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='xs'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
          adornedEnd={
            <IconButton
              color='tertiary'
              size='xs'
              variant='ghost'
              shape='square'
              className='adorned-end'
              icon={<Icon name='eye' />}
            />
          }
        />
      </section>
      <section style={{ margin: '30px' }}>
        <Input
          as='div'
          id='input-1'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='xl'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='비활성화'
          disabled
        />
        <Input
          as='div'
          id='input-2'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='lg'
          name='input-name'
          placeholder='값을 입력하세요.'
          defaultValue='읽기만 가능'
          readOnly
        />
        <Input
          as='div'
          id='input-3'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='md'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
        <Input
          as='div'
          id='input-4'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='sm'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
        <Input
          as='div'
          id='input-5'
          type='text'
          shape='rounded'
          variant='solid'
          color='primary'
          size='xs'
          name='input-name'
          defaultValue='defaultValue'
          placeholder='값을 입력하세요.'
        />
      </section>
      <section style={{ margin: '30px' }}>
        <Switch variant='primary' size='xl' id='switch-label-xl' defaultChecked={true}>
          <Label size='xl'>스위치 라벨</Label>
        </Switch>
        <Switch variant='primary' size='lg' id='switch-label-lg' defaultChecked={true}>
          <Label size='lg'>스위치 라벨</Label>
        </Switch>
        <Switch variant='primary' size='md' id='switch-label-md' defaultChecked={true}>
          <Label size='md'>스위치 라벨</Label>
        </Switch>
        <Switch variant='primary' size='sm' id='switch-label-sm' defaultChecked={true}>
          <Label size='sm'>스위치 라벨</Label>
        </Switch>
        <Switch variant='primary' size='xs' id='switch-label-xs' defaultChecked={true}>
          <Label size='xs'>스위치 라벨</Label>
        </Switch>
      </section>
      <section>
        <Switch
          variant='primary'
          size='xl'
          id='switch-primary-xl-1'
          defaultChecked={true}
          disabled={true}
        ></Switch>
        <Switch
          variant='primary'
          size='lg'
          id='switch-primary-lg-2'
          defaultChecked={false}
          disabled={true}
        ></Switch>
        <Switch variant='primary' size='md' id='switch-primary-md-3' defaultChecked={true}></Switch>
        <Switch variant='primary' size='sm' id='switch-primary-sm-4' defaultChecked={true}></Switch>
        <Switch variant='primary' size='xs' id='switch-primary-xs-5' defaultChecked={true}></Switch>
        <Switch
          variant='secondary'
          size='xl'
          id='switch-secondary-xl-1'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='secondary'
          size='lg'
          id='switch-secondary-lg-2'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='secondary'
          size='md'
          id='switch-secondary-md-3'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='secondary'
          size='sm'
          id='switch-secondary-sm-4'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='secondary'
          size='xs'
          id='switch-secondary-xs-5'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='tertiary'
          size='xl'
          id='switch-tertiary-xl-1'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='tertiary'
          size='lg'
          id='switch-tertiary-lg-2'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='tertiary'
          size='md'
          id='switch-tertiary-md-3'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='tertiary'
          size='sm'
          id='switch-tertiary-sm-4'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='tertiary'
          size='xs'
          id='switch-tertiary-xs-5'
          defaultChecked={true}
        ></Switch>

        <Switch variant='brand' size='xl' id='switch-brand-xl-1' defaultChecked={true}></Switch>
        <Switch variant='brand' size='lg' id='switch-brand-lg-2' defaultChecked={true}></Switch>
        <Switch variant='brand' size='md' id='switch-brand-md-3' defaultChecked={true}></Switch>
        <Switch variant='brand' size='sm' id='switch-brand-sm-4' defaultChecked={true}></Switch>
        <Switch variant='brand' size='xs' id='switch-brand-xs-5' defaultChecked={true}></Switch>

        <Switch
          variant='brand-sub'
          size='xl'
          id='switch-brand-sub-xl-1'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='brand-sub'
          size='lg'
          id='switch-brand-sub-lg-2'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='brand-sub'
          size='md'
          id='switch-brand-sub-md-3'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='brand-sub'
          size='sm'
          id='switch-brand-sub-sm-4'
          defaultChecked={true}
        ></Switch>
        <Switch
          variant='brand-sub'
          size='xs'
          id='switch-brand-sub-xs-5'
          defaultChecked={true}
        ></Switch>

        <Switch variant='success' size='xl' id='switch-success-xl-1' defaultChecked={true}></Switch>
        <Switch variant='success' size='lg' id='switch-success-lg-2' defaultChecked={true}></Switch>
        <Switch variant='success' size='md' id='switch-success-md-3' defaultChecked={true}></Switch>
        <Switch variant='success' size='sm' id='switch-success-sm-4' defaultChecked={true}></Switch>
        <Switch variant='success' size='xs' id='switch-success-xs-5' defaultChecked={true}></Switch>

        <Switch variant='warning' size='xl' id='switch-warning-xl-1' defaultChecked={true}></Switch>
        <Switch variant='warning' size='lg' id='switch-warning-lg-2' defaultChecked={true}></Switch>
        <Switch variant='warning' size='md' id='switch-warning-md-3' defaultChecked={true}></Switch>
        <Switch variant='warning' size='sm' id='switch-warning-sm-4' defaultChecked={true}></Switch>
        <Switch variant='warning' size='xs' id='switch-warning-xs-5' defaultChecked={true}></Switch>

        <Switch variant='danger' size='xl' id='switch-danger-xl-1' defaultChecked={true}></Switch>
        <Switch variant='danger' size='lg' id='switch-danger-lg-2' defaultChecked={true}></Switch>
        <Switch variant='danger' size='md' id='switch-danger-md-3' defaultChecked={true}></Switch>
        <Switch variant='danger' size='sm' id='switch-danger-sm-4' defaultChecked={true}></Switch>
        <Switch variant='danger' size='xs' id='switch-danger-xs-5' defaultChecked={true}></Switch>
      </section>
      <section>
        <FormFieldset size='xl' legend='체크박스 옵션 선택' required={true}>
          {/* ControlGroup */}
          <ControlGroup
            size='xl'
            direction='row'
            aria-describedby='checkbox-error-msg checkbox-warning-msg checkbox-success-msg checkbox-guide-msg'
          >
            <FormField as='label' htmlFor='formfield-test-1' size='xl'>
              <Checkbox
                as='span'
                id='formfield-test-1'
                name='formfield-test-checkbox'
                color='primary'
                size='xl'
                value='체크박스 옵션 1'
                required
                defaultChecked
              />
              <Label size='xl'>체크박스 옵션 1</Label>
            </FormField>
            <FormField as='label' htmlFor='formfield-test-2' size='xl'>
              <Checkbox
                as='span'
                id='formfield-test-2'
                name='formfield-test-checkbox'
                color='primary'
                size='xl'
                value='체크박스 옵션 2'
              />
              <Label size='xl'>체크박스 옵션 2</Label>
            </FormField>
            <FormField as='label' htmlFor='formfield-test-3' size='xl'>
              <Checkbox
                as='span'
                id='formfield-test-3'
                name='formfield-test-checkbox'
                color='primary'
                size='xl'
                value='체크박스 옵션 3'
              />
              <Label size='xl'>체크박스 옵션 3</Label>
            </FormField>
          </ControlGroup>
          {/* 유효성 검사 문구 */}
          <ValidationMsg
            id='checkbox-error-msg'
            variant='danger'
            role='alert'
            ariaLive='assertive'
            size='xl'
          >
            <Icon name='x-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 에러</span>
          </ValidationMsg>
          <ValidationMsg
            id='checkbox-warning-msg'
            variant='warning'
            role='status'
            ariaLive='polite'
            size='xl'
          >
            <Icon name='warning-triangle' className='icon' />
            <span className='text'>유효성검사 문구 : 워닝</span>
          </ValidationMsg>
          <ValidationMsg
            id='checkbox-success-msg'
            variant='success'
            role='status'
            ariaLive='polite'
            size='xl'
          >
            <Icon name='check-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 성공</span>
          </ValidationMsg>
          <ValidationMsg
            id='checkbox-guide-msg'
            variant='guide'
            role='status'
            ariaLive='polite'
            size='xl'
          >
            <Icon name='info-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 가이드</span>
          </ValidationMsg>
        </FormFieldset>
      </section>
      <section>
        <FormFieldset size='xl' legend='라디오 옵션 선택' required={true}>
          {/* ControlGroup */}
          <ControlGroup size='xl' direction='row'>
            <FormField as='label' htmlFor='formfield-test-4' size='xl'>
              <Radio
                as='span'
                id='formfield-test-4'
                name='formfield-test-radio'
                color='primary'
                size='xl'
                value='라디오 옵션 1'
                required
                defaultChecked
              />
              <Label size='xl'>라디오 옵션 1</Label>
            </FormField>
            <FormField as='label' htmlFor='formfield-test-5' size='xl'>
              <Radio
                as='span'
                id='formfield-test-5'
                name='formfield-test-radio'
                color='primary'
                size='xl'
                value='라디오 옵션 2'
              />
              <Label size='xl'>라디오 옵션 2</Label>
            </FormField>
            <FormField as='label' htmlFor='formfield-test-6' size='xl'>
              <Radio
                as='span'
                id='formfield-test-6'
                name='formfield-test-radio'
                color='primary'
                size='xl'
                value='라디오 옵션 3'
              />
              <Label size='xl'>라디오 옵션 3</Label>
            </FormField>
          </ControlGroup>
          {/* 유효성 검사 문구 */}
          <ValidationMsg variant='danger' role='alert' ariaLive='assertive' size='xl'>
            <Icon name='x-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 에러</span>
          </ValidationMsg>
          <ValidationMsg variant='warning' role='status' ariaLive='polite' size='xl'>
            <Icon name='warning-triangle' className='icon' />
            <span className='text'>유효성검사 문구 : 워닝</span>
          </ValidationMsg>
          <ValidationMsg variant='success' role='status' ariaLive='polite' size='xl'>
            <Icon name='check-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 성공</span>
          </ValidationMsg>
          <ValidationMsg variant='guide' role='status' ariaLive='polite' size='xl'>
            <Icon name='info-circle' className='icon' />
            <span className='text'>유효성검사 문구 : 가이드</span>
          </ValidationMsg>
        </FormFieldset>
      </section>
      <section>
        <div>
          <FormField as='label' htmlFor='formfield-test-7' size='xl'>
            <Checkbox
              as='span'
              id='formfield-test-7'
              name='formfield-checkbox'
              color='primary'
              size='xl'
              value='체크박스 옵션 1'
              defaultChecked
            />
            <Label size='xl'>체크박스 옵션 1</Label>
          </FormField>
          <FormField as='label' htmlFor='formfield-test-8' size='lg'>
            <Checkbox
              as='span'
              id='formfield-test-8'
              name='formfield-checkbox'
              color='primary'
              size='lg'
              value='체크박스 옵션 2'
            />
            <Label size='lg'>체크박스 옵션 2</Label>
          </FormField>
          <FormField as='label' htmlFor='formfield-test-9' size='md'>
            <Checkbox
              as='span'
              id='formfield-test-9'
              name='formfield-checkbox'
              color='primary'
              size='md'
              value='체크박스 옵션 3'
            />
            <Label size='md'>체크박스 옵션 3</Label>
          </FormField>
          <FormField as='label' htmlFor='formfield-test-10' size='sm'>
            <Checkbox
              as='span'
              id='formfield-test-10'
              name='formfield-checkbox'
              color='primary'
              size='sm'
              value='체크박스 옵션 4'
            />
            <Label size='sm'>체크박스 옵션 4</Label>
          </FormField>
          <FormField as='label' htmlFor='formfield-test-11' size='xs'>
            <Checkbox
              as='span'
              id='formfield-test-11'
              name='formfield-checkbox'
              color='primary'
              size='xs'
              value='체크박스 옵션 5'
            />
            <Label size='xs'>체크박스 옵션 5</Label>
          </FormField>
        </div>
        <div>
          <FormField as='label' htmlFor='formfield-test-12' size='xl'>
            <Radio
              as='span'
              id='formfield-test-12'
              name='formfield-radio'
              color='primary'
              size='xl'
              value='라디오 옵션 1'
              defaultChecked
            />
            <Label size='xl'>라디오 옵션 1</Label>
          </FormField>
          <FormField as='label' htmlFor='formfield-test-13' size='lg'>
            <Radio
              as='span'
              id='formfield-test-13'
              name='formfield-radio'
              color='primary'
              size='lg'
              value='라디오 옵션 2'
            />
            <Label size='lg'>라디오 옵션 2</Label>
          </FormField>
          <FormField as='label' htmlFor='formfield-test-14' size='md'>
            <Radio
              as='span'
              id='formfield-test-14'
              name='formfield-radio'
              color='primary'
              size='md'
              value='라디오 옵션 3'
            />
            <Label size='md'>라디오 옵션 3</Label>
          </FormField>
          <FormField as='label' htmlFor='formfield-test-15' size='sm'>
            <Radio
              as='span'
              id='formfield-test-15'
              name='formfield-radio'
              color='primary'
              size='sm'
              value='라디오 옵션 4'
            />
            <Label size='sm'>라디오 옵션 4</Label>
          </FormField>
          <FormField as='label' htmlFor='formfield-test-16' size='xs'>
            <Radio
              as='span'
              id='formfield-test-16'
              name='formfield-radio'
              color='primary'
              size='xs'
              value='라디오 옵션 5'
            />
            <Label size='xs'>라디오 옵션 5</Label>
          </FormField>
        </div>
      </section>
      <section>
        <div>
          <Label size='xl'>라벨 XL</Label>
          <Label size='lg'>라벨 LG</Label>
          <Label size='md'>라벨 MD</Label>
          <Label size='sm'>라벨 SM</Label>
          <Label size='xs'>라벨 XS</Label>
        </div>
      </section>
      <section>
        <div>
          <Checkbox
            as='label'
            name='checkbox-standalone-1'
            color='primary'
            size='xl'
            defaultChecked
          />
          <Checkbox as='label' name='checkbox-standalone-1' color='primary' size='lg' />
          <Checkbox as='label' name='checkbox-standalone-1' color='primary' size='md' />
          <Checkbox as='label' name='checkbox-standalone-1' color='primary' size='sm' />
          <Checkbox as='label' name='checkbox-standalone-1' color='primary' size='xs' />
        </div>
        <div>
          <Checkbox
            name='checkbox-standalone-2'
            color='primary'
            size='xl'
            defaultChecked
            disabled
          />
          <Checkbox as='label' name='checkbox-standalone-2' color='primary' size='lg' disabled />
          <Checkbox as='label' name='checkbox-standalone-2' color='primary' size='md' disabled />
          <Checkbox as='label' name='checkbox-standalone-2' color='primary' size='sm' disabled />
          <Checkbox as='label' name='checkbox-standalone-2' color='primary' size='xs' disabled />
        </div>
        <div>
          <Checkbox
            as='label'
            name='checkbox-standalone-3'
            color='secondary'
            size='xl'
            defaultChecked
          />
          <Checkbox as='label' name='checkbox-standalone-3' color='secondary' size='lg' />
          <Checkbox as='label' name='checkbox-standalone-3' color='secondary' size='md' />
          <Checkbox as='label' name='checkbox-standalone-3' color='secondary' size='sm' />
          <Checkbox as='label' name='checkbox-standalone-3' color='secondary' size='xs' />
        </div>
        <div>
          <Checkbox
            as='label'
            name='checkbox-standalone-4'
            color='tertiary'
            size='xl'
            defaultChecked
          />
          <Checkbox as='label' name='checkbox-standalone-4' color='tertiary' size='lg' />
          <Checkbox as='label' name='checkbox-standalone-4' color='tertiary' size='md' />
          <Checkbox as='label' name='checkbox-standalone-4' color='tertiary' size='sm' />
          <Checkbox as='label' name='checkbox-standalone-4' color='tertiary' size='xs' />
        </div>
        <div>
          <Checkbox
            as='label'
            name='checkbox-standalone-5'
            color='brand'
            size='xl'
            defaultChecked
          />
          <Checkbox as='label' name='checkbox-standalone-5' color='brand' size='lg' />
          <Checkbox as='label' name='checkbox-standalone-5' color='brand' size='md' />
          <Checkbox as='label' name='checkbox-standalone-5' color='brand' size='sm' />
          <Checkbox as='label' name='checkbox-standalone-5' color='brand' size='xs' />
        </div>

        <div>
          <Checkbox
            as='label'
            name='checkbox-standalone-6'
            color='brand-sub'
            size='xl'
            defaultChecked
          />
          <Checkbox as='label' name='checkbox-standalone-6' color='brand-sub' size='lg' />
          <Checkbox as='label' name='checkbox-standalone-6' color='brand-sub' size='md' />
          <Checkbox as='label' name='checkbox-standalone-6' color='brand-sub' size='sm' />
          <Checkbox as='label' name='checkbox-standalone-6' color='brand-sub' size='xs' />
        </div>
        <div>
          <Checkbox
            as='label'
            name='checkbox-standalone-7'
            color='success'
            size='xl'
            defaultChecked
          />
          <Checkbox as='label' name='checkbox-standalone-7' color='success' size='lg' />
          <Checkbox as='label' name='checkbox-standalone-7' color='success' size='md' />
          <Checkbox as='label' name='checkbox-standalone-7' color='success' size='sm' />
          <Checkbox as='label' name='checkbox-standalone-7' color='success' size='xs' />
        </div>
        <div>
          <Checkbox
            as='label'
            name='checkbox-standalone-8'
            color='warning'
            size='xl'
            defaultChecked
          />
          <Checkbox as='label' name='checkbox-standalone-8' color='warning' size='lg' />
          <Checkbox as='label' name='checkbox-standalone-8' color='warning' size='md' />
          <Checkbox as='label' name='checkbox-standalone-8' color='warning' size='sm' />
          <Checkbox as='label' name='checkbox-standalone-8' color='warning' size='xs' />
        </div>
        <div>
          <Checkbox
            as='label'
            name='checkbox-standalone-9'
            color='danger'
            size='xl'
            defaultChecked
          />
          <Checkbox as='label' name='checkbox-standalone-9' color='danger' size='lg' />
          <Checkbox as='label' name='checkbox-standalone-9' color='danger' size='md' />
          <Checkbox as='label' name='checkbox-standalone-9' color='danger' size='sm' />
          <Checkbox as='label' name='checkbox-standalone-9' color='danger' size='xs' />
        </div>
      </section>
      <section>
        <div>
          <Radio
            as='label'
            name='checkbox-standalone-10'
            color='primary'
            size='xl'
            defaultChecked
          />
          <Radio as='label' name='checkbox-standalone-10' color='primary' size='lg' />
          <Radio as='label' name='checkbox-standalone-10' color='primary' size='md' />
          <Radio as='label' name='checkbox-standalone-10' color='primary' size='sm' />
          <Radio as='label' name='checkbox-standalone-10' color='primary' size='xs' />
        </div>
        <div>
          <Radio
            as='label'
            name='checkbox-standalone-11'
            color='primary'
            size='xl'
            defaultChecked
            disabled
          />
          <Radio as='label' name='checkbox-standalone-11' color='primary' size='lg' disabled />
          <Radio as='label' name='checkbox-standalone-11' color='primary' size='md' disabled />
          <Radio as='label' name='checkbox-standalone-11' color='primary' size='sm' disabled />
          <Radio as='label' name='checkbox-standalone-11' color='primary' size='xs' disabled />
        </div>
        <div>
          <Radio
            as='label'
            name='checkbox-standalone-12'
            color='secondary'
            size='xl'
            defaultChecked
          />
          <Radio as='label' name='checkbox-standalone-12' color='secondary' size='lg' />
          <Radio as='label' name='checkbox-standalone-12' color='secondary' size='md' />
          <Radio as='label' name='checkbox-standalone-12' color='secondary' size='sm' />
          <Radio as='label' name='checkbox-standalone-12' color='secondary' size='xs' />
        </div>
        <div>
          <Radio
            as='label'
            name='checkbox-standalone-13'
            color='tertiary'
            size='xl'
            defaultChecked
          />
          <Radio as='label' name='checkbox-standalone-13' color='tertiary' size='lg' />
          <Radio as='label' name='checkbox-standalone-13' color='tertiary' size='md' />
          <Radio as='label' name='checkbox-standalone-13' color='tertiary' size='sm' />
          <Radio as='label' name='checkbox-standalone-13' color='tertiary' size='xs' />
        </div>
        <div>
          <Radio as='label' name='checkbox-standalone-14' color='brand' size='xl' defaultChecked />
          <Radio as='label' name='checkbox-standalone-14' color='brand' size='lg' />
          <Radio as='label' name='checkbox-standalone-14' color='brand' size='md' />
          <Radio as='label' name='checkbox-standalone-14' color='brand' size='sm' />
          <Radio as='label' name='checkbox-standalone-14' color='brand' size='xs' />
        </div>
        <div>
          <Radio
            as='label'
            name='checkbox-standalone-15'
            color='brand-sub'
            size='xl'
            defaultChecked
          />
          <Radio as='label' name='checkbox-standalone-15' color='brand-sub' size='lg' />
          <Radio as='label' name='checkbox-standalone-15' color='brand-sub' size='md' />
          <Radio as='label' name='checkbox-standalone-15' color='brand-sub' size='sm' />
          <Radio as='label' name='checkbox-standalone-15' color='brand-sub' size='xs' />
        </div>
        <div>
          <Radio
            as='label'
            name='checkbox-standalone-16'
            color='success'
            size='xl'
            defaultChecked
          />
          <Radio as='label' name='checkbox-standalone-16' color='success' size='lg' />
          <Radio as='label' name='checkbox-standalone-16' color='success' size='md' />
          <Radio as='label' name='checkbox-standalone-16' color='success' size='sm' />
          <Radio as='label' name='checkbox-standalone-16' color='success' size='xs' />
        </div>
        <div>
          <Radio
            as='label'
            name='checkbox-standalone-17'
            color='warning'
            size='xl'
            defaultChecked
          />
          <Radio as='label' name='checkbox-standalone-17' color='warning' size='lg' />
          <Radio as='label' name='checkbox-standalone-17' color='warning' size='md' />
          <Radio as='label' name='checkbox-standalone-17' color='warning' size='sm' />
          <Radio as='label' name='checkbox-standalone-17' color='warning' size='xs' />
        </div>
        <div>
          <Radio as='label' name='checkbox-standalone-18' color='danger' size='xl' defaultChecked />
          <Radio as='label' name='checkbox-standalone-18' color='danger' size='lg' />
          <Radio as='label' name='checkbox-standalone-18' color='danger' size='md' />
          <Radio as='label' name='checkbox-standalone-18' color='danger' size='sm' />
          <Radio as='label' name='checkbox-standalone-18' color='danger' size='xs' />
        </div>
      </section>
      <section>
        <ValidationMsg variant='danger' size='xl' role='alert' ariaLive='assertive'>
          <Icon name='x-circle' className='icon' /> 유효성검사 문구 : 에러
        </ValidationMsg>
        <ValidationMsg variant='warning' size='xl' role='status' ariaLive='polite'>
          <Icon name='warning-triangle' className='icon' />
          유효성검사 문구 : 워닝
        </ValidationMsg>
        <ValidationMsg variant='success' size='xl' role='status' ariaLive='polite'>
          <Icon name='check-circle' className='icon' />
          유효성검사 문구 : 성공
        </ValidationMsg>
        <ValidationMsg variant='guide' size='xl' role='status' ariaLive='polite'>
          <Icon name='info-circle' className='icon' />
          유효성검사 문구 : 가이드
        </ValidationMsg>
      </section>
      <section>
        <ValidationMsg variant='danger' size='lg' role='alert' ariaLive='assertive'>
          <Icon name='x-circle' className='icon' /> 유효성검사 문구 : 에러
        </ValidationMsg>
        <ValidationMsg variant='warning' size='lg' role='status' ariaLive='polite'>
          <Icon name='warning-triangle' className='icon' />
          유효성검사 문구 : 워닝
        </ValidationMsg>
        <ValidationMsg variant='success' size='lg' role='status' ariaLive='polite'>
          <Icon name='check-circle' className='icon' />
          유효성검사 문구 : 성공
        </ValidationMsg>
        <ValidationMsg variant='guide' size='lg' role='status' ariaLive='polite'>
          <Icon name='info-circle' className='icon' />
          유효성검사 문구 : 가이드
        </ValidationMsg>
      </section>
      <section>
        <ValidationMsg variant='danger' size='md' role='alert' ariaLive='assertive'>
          <Icon name='x-circle' className='icon' /> 유효성검사 문구 : 에러
        </ValidationMsg>
        <ValidationMsg variant='warning' size='md' role='status' ariaLive='polite'>
          <Icon name='warning-triangle' className='icon' />
          유효성검사 문구 : 워닝
        </ValidationMsg>
        <ValidationMsg variant='success' size='md' role='status' ariaLive='polite'>
          <Icon name='check-circle' className='icon' />
          유효성검사 문구 : 성공
        </ValidationMsg>
        <ValidationMsg variant='guide' size='md' role='status' ariaLive='polite'>
          <Icon name='info-circle' className='icon' />
          유효성검사 문구 : 가이드
        </ValidationMsg>
      </section>
      <section>
        <ValidationMsg variant='danger' size='sm' role='alert' ariaLive='assertive'>
          <Icon name='x-circle' className='icon' /> 유효성검사 문구 : 에러
        </ValidationMsg>
        <ValidationMsg variant='warning' size='sm' role='status' ariaLive='polite'>
          <Icon name='warning-triangle' className='icon' />
          유효성검사 문구 : 워닝
        </ValidationMsg>
        <ValidationMsg variant='success' size='sm' role='status' ariaLive='polite'>
          <Icon name='check-circle' className='icon' />
          유효성검사 문구 : 성공
        </ValidationMsg>
        <ValidationMsg variant='guide' size='sm' role='status' ariaLive='polite'>
          <Icon name='info-circle' className='icon' />
          유효성검사 문구 : 가이드
        </ValidationMsg>
      </section>
      <section>
        <ValidationMsg variant='danger' size='xs' role='alert' ariaLive='assertive'>
          <Icon name='x-circle' className='icon' /> 유효성검사 문구 : 에러
        </ValidationMsg>
        <ValidationMsg variant='warning' size='xs' role='status' ariaLive='polite'>
          <Icon name='warning-triangle' className='icon' />
          유효성검사 문구 : 워닝
        </ValidationMsg>
        <ValidationMsg variant='success' size='xs' role='status' ariaLive='polite'>
          <Icon name='check-circle' className='icon' />
          유효성검사 문구 : 성공
        </ValidationMsg>
        <ValidationMsg variant='guide' size='xs' role='status' ariaLive='polite'>
          <Icon name='info-circle' className='icon' />
          유효성검사 문구 : 가이드
        </ValidationMsg>
      </section>
      <section style={{ width: '100%' }}>
        <ActionBar size='xl'>
          <ButtonGroup size='xl' align='left'>
            <Button color='tertiary' size='xl' variant='outline' shape='rounded'>
              Brand XL 버튼
            </Button>
          </ButtonGroup>
          <ButtonGroup size='xl' align='right' role='group' ariaLabel='작업 버튼'>
            <Button color='brand' size='xl' variant='outline' shape='rounded'>
              Brand XL 버튼
            </Button>
            <Button color='brand' size='xl' variant='solid' shape='rounded'>
              Brand XL 버튼
            </Button>
          </ButtonGroup>
        </ActionBar>
      </section>
      <section>
        <ButtonGroup size='xl' align='left' role='group' ariaLabel='작업 버튼'>
          <Button color='brand' size='xl' variant='outline' shape='rounded'>
            Brand XL 버튼
          </Button>
          <Button color='brand' size='xl' variant='solid' shape='rounded'>
            Brand XL 버튼
          </Button>
        </ButtonGroup>
        <ButtonGroup size='lg' align='left' role='group' ariaLabel='작업 버튼'>
          <Button color='brand' size='lg' variant='outline' shape='rounded'>
            Brand lg 버튼
          </Button>
          <Button color='brand' size='lg' variant='solid' shape='rounded'>
            Brand lg 버튼
          </Button>
        </ButtonGroup>
        <ButtonGroup size='md' align='left' role='group' ariaLabel='작업 버튼'>
          <Button color='brand' size='md' variant='outline' shape='rounded'>
            Brand md 버튼
          </Button>
          <Button color='brand' size='md' variant='solid' shape='rounded'>
            Brand md 버튼
          </Button>
        </ButtonGroup>
        <ButtonGroup size='sm' align='left' role='group' ariaLabel='작업 버튼'>
          <Button color='brand' size='sm' variant='outline' shape='rounded'>
            Brand sm 버튼
          </Button>
          <Button color='brand' size='sm' variant='solid' shape='rounded'>
            Brand sm 버튼
          </Button>
        </ButtonGroup>
        <ButtonGroup size='xs' align='left' role='group' ariaLabel='작업 버튼'>
          <Button color='brand' size='xs' variant='outline' shape='rounded'>
            Brand xs 버튼
          </Button>
          <Button color='brand' size='xs' variant='solid' shape='rounded'>
            Brand xs 버튼
          </Button>
        </ButtonGroup>
      </section>
      <section>
        <div>
          <RingSpinner color='primary' size='xl' variant='open-ring' />
          <RingSpinner color='primary' size='lg' variant='open-ring' />
          <RingSpinner color='primary' size='md' variant='open-ring' />
          <RingSpinner color='primary' size='sm' variant='open-ring' />
          <RingSpinner color='primary' size='xs' variant='open-ring' />
        </div>
        <div>
          <RingSpinner color='primary' size='xl' variant='closed-ring' />
          <RingSpinner color='primary' size='lg' variant='closed-ring' />
          <RingSpinner color='primary' size='md' variant='closed-ring' />
          <RingSpinner color='primary' size='sm' variant='closed-ring' />
          <RingSpinner color='primary' size='xs' variant='closed-ring' />
        </div>
        <div>
          <RingSpinner color='secondary' size='xl' variant='open-ring' />
          <RingSpinner color='secondary' size='lg' variant='open-ring' />
          <RingSpinner color='secondary' size='md' variant='open-ring' />
          <RingSpinner color='secondary' size='sm' variant='open-ring' />
          <RingSpinner color='secondary' size='xs' variant='open-ring' />
        </div>
        <div>
          <RingSpinner color='secondary' size='xl' variant='closed-ring' />
          <RingSpinner color='secondary' size='lg' variant='closed-ring' />
          <RingSpinner color='secondary' size='md' variant='closed-ring' />
          <RingSpinner color='secondary' size='sm' variant='closed-ring' />
          <RingSpinner color='secondary' size='xs' variant='closed-ring' />
        </div>
        <div>
          <RingSpinner color='tertiary' size='xl' variant='open-ring' />
          <RingSpinner color='tertiary' size='lg' variant='open-ring' />
          <RingSpinner color='tertiary' size='md' variant='open-ring' />
          <RingSpinner color='tertiary' size='sm' variant='open-ring' />
          <RingSpinner color='tertiary' size='xs' variant='open-ring' />
        </div>
        <div>
          <RingSpinner color='tertiary' size='xl' variant='closed-ring' />
          <RingSpinner color='tertiary' size='lg' variant='closed-ring' />
          <RingSpinner color='tertiary' size='md' variant='closed-ring' />
          <RingSpinner color='tertiary' size='sm' variant='closed-ring' />
          <RingSpinner color='tertiary' size='xs' variant='closed-ring' />
        </div>
        <div>
          <RingSpinner color='brand' size='xl' variant='open-ring' />
          <RingSpinner color='brand' size='lg' variant='open-ring' />
          <RingSpinner color='brand' size='md' variant='open-ring' />
          <RingSpinner color='brand' size='sm' variant='open-ring' />
          <RingSpinner color='brand' size='xs' variant='open-ring' />
        </div>
        <div>
          <RingSpinner color='brand' size='xl' variant='closed-ring' />
          <RingSpinner color='brand' size='lg' variant='closed-ring' />
          <RingSpinner color='brand' size='md' variant='closed-ring' />
          <RingSpinner color='brand' size='sm' variant='closed-ring' />
          <RingSpinner color='brand' size='xs' variant='closed-ring' />
        </div>
        <div>
          <RingSpinner color='brand-sub' size='xl' variant='open-ring' />
          <RingSpinner color='brand-sub' size='lg' variant='open-ring' />
          <RingSpinner color='brand-sub' size='md' variant='open-ring' />
          <RingSpinner color='brand-sub' size='sm' variant='open-ring' />
          <RingSpinner color='brand-sub' size='xs' variant='open-ring' />
        </div>
        <div>
          <RingSpinner color='brand-sub' size='xl' variant='closed-ring' />
          <RingSpinner color='brand-sub' size='lg' variant='closed-ring' />
          <RingSpinner color='brand-sub' size='md' variant='closed-ring' />
          <RingSpinner color='brand-sub' size='sm' variant='closed-ring' />
          <RingSpinner color='brand-sub' size='xs' variant='closed-ring' />
        </div>
        <div>
          <RingSpinner color='success' size='xl' variant='open-ring' />
          <RingSpinner color='success' size='lg' variant='open-ring' />
          <RingSpinner color='success' size='md' variant='open-ring' />
          <RingSpinner color='success' size='sm' variant='open-ring' />
          <RingSpinner color='success' size='xs' variant='open-ring' />
        </div>
        <div>
          <RingSpinner color='success' size='xl' variant='closed-ring' />
          <RingSpinner color='success' size='lg' variant='closed-ring' />
          <RingSpinner color='success' size='md' variant='closed-ring' />
          <RingSpinner color='success' size='sm' variant='closed-ring' />
          <RingSpinner color='success' size='xs' variant='closed-ring' />
        </div>
        <div>
          <RingSpinner color='warning' size='xl' variant='open-ring' />
          <RingSpinner color='warning' size='lg' variant='open-ring' />
          <RingSpinner color='warning' size='md' variant='open-ring' />
          <RingSpinner color='warning' size='sm' variant='open-ring' />
          <RingSpinner color='warning' size='xs' variant='open-ring' />
        </div>
        <div>
          <RingSpinner color='warning' size='xl' variant='closed-ring' />
          <RingSpinner color='warning' size='lg' variant='closed-ring' />
          <RingSpinner color='warning' size='md' variant='closed-ring' />
          <RingSpinner color='warning' size='sm' variant='closed-ring' />
          <RingSpinner color='warning' size='xs' variant='closed-ring' />
        </div>
        <div>
          <RingSpinner color='danger' size='xl' variant='open-ring' />
          <RingSpinner color='danger' size='lg' variant='open-ring' />
          <RingSpinner color='danger' size='md' variant='open-ring' />
          <RingSpinner color='danger' size='sm' variant='open-ring' />
          <RingSpinner color='danger' size='xs' variant='open-ring' />
        </div>
        <div>
          <RingSpinner color='danger' size='xl' variant='closed-ring' />
          <RingSpinner color='danger' size='lg' variant='closed-ring' />
          <RingSpinner color='danger' size='md' variant='closed-ring' />
          <RingSpinner color='danger' size='sm' variant='closed-ring' />
          <RingSpinner color='danger' size='xs' variant='closed-ring' />
        </div>
      </section>
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
          <Button
            color='brand'
            size='xl'
            variant='solid'
            shape='rounded'
            endSpinner={<RingSpinner color='brand-solid' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='brand'
            size='xl'
            variant='outline'
            shape='rounded'
            endSpinner={<RingSpinner color='brand' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='brand'
            size='xl'
            variant='soft'
            shape='rounded'
            endSpinner={<RingSpinner color='brand-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='brand'
            size='xl'
            variant='ghost'
            shape='rounded'
            endSpinner={<RingSpinner color='brand' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='brand-sub'
            size='xl'
            variant='solid'
            shape='rounded'
            endSpinner={<RingSpinner color='brand-sub-solid' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='brand-sub'
            size='xl'
            variant='outline'
            shape='rounded'
            endSpinner={<RingSpinner color='brand-sub' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='brand-sub'
            size='xl'
            variant='soft'
            shape='rounded'
            endSpinner={<RingSpinner color='brand-sub-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='brand-sub'
            size='xl'
            variant='ghost'
            shape='rounded'
            endSpinner={<RingSpinner color='brand-sub' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='primary'
            size='xl'
            variant='solid'
            shape='rounded'
            endSpinner={<RingSpinner color='primary-solid' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='primary'
            size='xl'
            variant='outline'
            shape='rounded'
            endSpinner={<RingSpinner color='primary' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='primary'
            size='xl'
            variant='soft'
            shape='rounded'
            endSpinner={<RingSpinner color='primary-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='primary'
            size='xl'
            variant='ghost'
            shape='rounded'
            endSpinner={<RingSpinner color='primary' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='secondary'
            size='xl'
            variant='solid'
            shape='rounded'
            endSpinner={<RingSpinner color='secondary-solid' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='secondary'
            size='xl'
            variant='outline'
            shape='rounded'
            endSpinner={<RingSpinner color='secondary' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='secondary'
            size='xl'
            variant='soft'
            shape='rounded'
            endSpinner={<RingSpinner color='secondary-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='secondary'
            size='xl'
            variant='ghost'
            shape='rounded'
            endSpinner={<RingSpinner color='secondary-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='tertiary'
            size='xl'
            variant='solid'
            shape='rounded'
            endSpinner={<RingSpinner color='tertiary-solid' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='tertiary'
            size='xl'
            variant='outline'
            shape='rounded'
            endSpinner={<RingSpinner color='tertiary' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='tertiary'
            size='xl'
            variant='soft'
            shape='rounded'
            endSpinner={<RingSpinner color='tertiary' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='tertiary'
            size='xl'
            variant='ghost'
            shape='rounded'
            endSpinner={<RingSpinner color='tertiary-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='success'
            size='xl'
            variant='solid'
            shape='rounded'
            endSpinner={<RingSpinner color='success-solid' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='success'
            size='xl'
            variant='outline'
            shape='rounded'
            endSpinner={<RingSpinner color='success' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='success'
            size='xl'
            variant='soft'
            shape='rounded'
            endSpinner={<RingSpinner color='success-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='success'
            size='xl'
            variant='ghost'
            shape='rounded'
            endSpinner={<RingSpinner color='success-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='warning'
            size='xl'
            variant='solid'
            shape='rounded'
            endSpinner={<RingSpinner color='warning-solid' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='warning'
            size='xl'
            variant='outline'
            shape='rounded'
            endSpinner={<RingSpinner color='warning' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='warning'
            size='xl'
            variant='soft'
            shape='rounded'
            endSpinner={<RingSpinner color='warning-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='warning'
            size='xl'
            variant='ghost'
            shape='rounded'
            endSpinner={<RingSpinner color='warning' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='danger'
            size='xl'
            variant='solid'
            shape='rounded'
            endSpinner={<RingSpinner color='danger-solid' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='danger'
            size='xl'
            variant='outline'
            shape='rounded'
            endSpinner={<RingSpinner color='danger' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='danger'
            size='xl'
            variant='soft'
            shape='rounded'
            endSpinner={<RingSpinner color='danger-soft' size='xl' variant='closed-ring' />}
          >
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
          <Button
            color='danger'
            size='xl'
            variant='ghost'
            shape='rounded'
            endSpinner={<RingSpinner color='danger' size='xl' variant='closed-ring' />}
          >
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
        {/* Label - Form field 라벨, Checkbox / Radio 라벨, 버튼 그룹 / 옵션 그룹 라벨, 테이블 헤더 라벨 */}
        <span style={labelStyles.l1}>
          입력 필드, 버튼 그룹, 옵션 그룹 등 UI 요소의 이름을 나타내는 기본 라벨 텍스트입니다 — abc
          0123456789 @#%!?*
        </span>
        <span style={labelStyles.l1}>
          入力フィールド、ボタングループ、オプショングループなどのUI要素名を示す基本ラベル用書体です
          — abc 0123456789 @#%!?*
        </span>

        <span style={labelStyles.l2}>
          입력 필드, 버튼 그룹, 옵션 그룹 등 UI 요소의 이름을 나타내는 기본 라벨 텍스트입니다 — abc
          0123456789 @#%!?*
        </span>
        <span style={labelStyles.l2}>
          入力フィールド、ボタングループ、オプショングループなどのUI要素名を示す基本ラベル用書体です
          — abc 0123456789 @#%!?*
        </span>

        <span style={labelStyles.l3}>
          입력 필드, 버튼 그룹, 옵션 그룹 등 UI 요소의 이름을 나타내는 기본 라벨 텍스트입니다 — abc
          0123456789 @#%!?*
        </span>
        <span style={labelStyles.l3}>
          入力フィールド、ボタングループ、オプショングループなどのUI要素名を示す基本ラベル用書体です
          — abc 0123456789 @#%!?*
        </span>
      </section>

      <section>
        {/* Caption - Form Validation 메시지 */}
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
