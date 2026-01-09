import React from 'react';

// 아이콘 svg import
import SearchIcon from '@/assets/icons/icon-search.svg?react';
import LogoutIcon from '@/assets/icons/icon-logout.svg?react';
import CheckCircleIcon from '@/assets/icons/icon-check_circle.svg?react';
import CheckInfoIcon from '@/assets/icons/icon-info_circle.svg?react';
import XCircleIcon from '@/assets/icons/icon-x_circle.svg?react';
import WarningTriangleIcon from '@/assets/icons/icon-warning_triangle.svg?react';
import CheckIcon from '@/assets/icons/icon-check.svg?react';
import XIcon from '@/assets/icons/icon-x.svg?react';
import EyeOffIcon from '@/assets/icons/icon-eye-off.svg?react';
import EyeIcon from '@/assets/icons/icon-eye.svg?react';
import ArrowDownIcon from '@/assets/icons/icon-arrow-down.svg?react';
import ArrowUpIcon from '@/assets/icons/icon-arrow-up.svg?react';
import RoundCheckIcon from '@/assets/icons/icon-round_check.svg?react';
import SearchXIcon from '@/assets/icons/icon-search-x.svg?react';
import GlobeIcon from '@/assets/icons/icon-globe.svg?react';
import CalendarIcon from '@/assets/icons/icon-calendar.svg?react';
import ChevronLeftIcon from '@/assets/icons/icon-chevron-left.svg?react';
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg?react';
import UploadIcon from '@/assets/icons/icon-upload.svg?react';
import FileDocIcon from '@/assets/icons/icon-file-doc.svg?react';
import FileImageIcon from '@/assets/icons/icon-file-image.svg?react';
import FileVideoIcon from '@/assets/icons/icon-file-video.svg?react';
import FileZipIcon from '@/assets/icons/icon-file-zip.svg?react';
import HouseIcon from '@/assets/icons/icon-house.svg?react';
import BellIcon from '@/assets/icons/icon-bell.svg?react';
import VolumeOnIcon from '@/assets/icons/icon-volume-on.svg?react';
import VolumeOffIcon from '@/assets/icons/icon-volume-off.svg?react';
import MapPinIcon from '@/assets/icons/icon-map-pin.svg?react';
import ArrowUpRightIcon from '@/assets/icons/icon-arrow-up-right.svg?react';
import TrashcanIcon from '@/assets/icons/icon-trash-can.svg?react';
import FileIcon from '@/assets/icons/icon-file.svg?react';
import ArrowDownUpIcon from '@/assets/icons/icon-arrow-down-up.svg?react';
import ArrowDownWideNarrowIcon from '@/assets/icons/icon-arrow-down-wide-narrow.svg?react';
import ArrowUpNarrowWideIcon from '@/assets/icons/icon-arrow-up-narrow-wide.svg?react';
import MegaphoneIcon from '@/assets/icons/icon-megaphone.svg?react';
import LockIcon from '@/assets/icons/icon-lock.svg?react';
import ChevronsLeftIcon from '@/assets/icons/icon-chevrons-left.svg?react';
import ChevronsRightIcon from '@/assets/icons/icon-chevrons-right.svg?react';
import EllipsisIcon from '@/assets/icons/icon-ellipsis.svg?react';
import DownloadIcon from '@/assets/icons/icon-download.svg?react';
import SendIcon from '@/assets/icons/icon-send.svg?react';
import ShareIcon from '@/assets/icons/icon-share.svg?react';
import HashIcon from '@/assets/icons/icon-hash.svg?react';
import OuterLinkIcon from '@/assets/icons/icon-square-arrow-out-up-right.svg?react';
import RotateIcon from '@/assets/icons/icon-rotate-ccw.svg?react';
import UserIcon from '@/assets/icons/icon-user.svg?react';
import ListIcon from '@/assets/icons/icon-list.svg?react';

const iconMap = {
  search: SearchIcon,
  logout: LogoutIcon,
  'check-circle': CheckCircleIcon,
  'info-circle': CheckInfoIcon,
  'x-circle': XCircleIcon,
  'warning-triangle': WarningTriangleIcon,
  check: CheckIcon,
  x: XIcon,
  eye: EyeIcon,
  'eye-off': EyeOffIcon,
  'arrow-down': ArrowDownIcon,
  'arrow-up': ArrowUpIcon,
  'round-check': RoundCheckIcon,
  'search-x': SearchXIcon,
  globe: GlobeIcon,
  calendar: CalendarIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  upload: UploadIcon,
  'file-doc': FileDocIcon,
  'file-image': FileImageIcon,
  'file-video': FileVideoIcon,
  'file-zip': FileZipIcon,
  house: HouseIcon,
  bell: BellIcon,
  'volume-on': VolumeOnIcon,
  'volume-off': VolumeOffIcon,
  'map-pin': MapPinIcon,
  'arrow-up-right': ArrowUpRightIcon,
  trashcan: TrashcanIcon,
  file: FileIcon,
  'arrow-down-up': ArrowDownUpIcon,
  'arrow-down-wide-narrow': ArrowDownWideNarrowIcon,
  'arrow-up-narrow-wide': ArrowUpNarrowWideIcon,
  megaphone: MegaphoneIcon,
  lock: LockIcon,
  'chevrons-left': ChevronsLeftIcon,
  'chevrons-right': ChevronsRightIcon,
  ellipsis: EllipsisIcon,
  download: DownloadIcon,
  send: SendIcon,
  share: ShareIcon,
  hash: HashIcon,
  link: OuterLinkIcon,
  rotate: RotateIcon,
  user: UserIcon,
  list: ListIcon,
  // 다른 아이콘들도 여기에 추가
};

type IconName = keyof typeof iconMap;

interface IconProps extends React.HTMLAttributes<SVGSVGElement> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'bevel' | 'miter';
}

// size variant 매핑
const ICON_SIZES: Record<'sm' | 'md' | 'lg', number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const Icon: React.FC<IconProps> = ({
  name,
  color,
  size,
  strokeWidth,
  strokeLinecap,
  strokeLinejoin,
  ...props
}) => {
  const SvgIcon = iconMap[name]; // name에 맞는 아이콘 가져오기
  if (!SvgIcon) return null;

  // ✅ 추가: SvgIcon이 컴포넌트(함수)가 아니라 문자열(경로)일 경우 처리
  if (typeof SvgIcon === 'string') {
    const dimensionProps = size ? { width: ICON_SIZES[size], height: ICON_SIZES[size] } : {};
    return (
      <img
        src={SvgIcon}
        alt={name}
        style={{ ...dimensionProps }}
        {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  // size가 지정되었을 때만 width/height 적용
  const dimensionProps = size ? { width: ICON_SIZES[size], height: ICON_SIZES[size] } : {};

  return (
    <SvgIcon
      fill={color}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden
      {...dimensionProps}
      {...props}
    />
  );
};
export default Icon;
