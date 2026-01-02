import Button from '../Button/Button';

interface ProfileEditModalProps {
  onClose: () => void;
  // 부모(Provider)와 규격을 맞추기 위해 HTMLElement를 유지합니다.
  firstFocusableRef: React.RefObject<HTMLElement | null>;
}

const ProfileEditModal = ({ onClose, firstFocusableRef }: ProfileEditModalProps) => {
  return (
    <div className='base-modal'>
      <div className='modal-header'>
        <h2>프로필 정보 수정</h2>
      </div>
      <div className='modal-body'>
        <label htmlFor='user-name'>이름</label>
        {/* [해결 포인트] 
          부모가 준 광범위한 ref를 input 전용 ref 타입으로 형변환하여 연결합니다.
        */}
        <input
          id='user-name'
          ref={firstFocusableRef as React.RefObject<HTMLInputElement>}
          type='text'
          defaultValue='홍길동'
        />
        <p className='helper-text'>실명을 입력해 주세요.</p>
      </div>
      <div className='modal-footer'>
        <Button variant='solid' shape='rounded' size='md' onClick={onClose}>
          저장하기
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditModal;
