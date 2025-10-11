import { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>

type IconBaseProps = IconProps & { size?: number }

function SvgIcon({ size = 20, strokeWidth = 1.6, children, ...rest }: IconBaseProps) {
  const ariaHidden = rest['aria-label'] ? undefined : true
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden={ariaHidden}
      {...rest}
    >
      {children}
    </svg>
  )
}

export function HomeIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3.6 11 12 4l8.4 7" />
      <path d="M6 10.5v9.75h12V10.5" />
      <path d="M9.75 20.25V14.5h4.5v5.75" />
    </SvgIcon>
  )
}

export function ClientsIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8.25 18.75a3.75 3.75 0 0 1 7.5 0" />
      <circle cx="12" cy="10" r="3" />
      <path d="M5.25 18a4.5 4.5 0 0 1 3-4.24" />
      <path d="M18.75 18a4.5 4.5 0 0 0-3-4.24" />
      <path d="M16.5 9a2.25 2.25 0 1 0-1.5-3.99" />
      <path d="M7.5 9a2.25 2.25 0 1 1 1.5-3.99" />
    </SvgIcon>
  )
}

export function EquipmentIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8.5 9.25V7.75a3.5 3.5 0 0 1 7 0v1.5" />
      <rect x="4.5" y="9.25" width="15" height="10.25" rx="1.75" />
      <path d="M4.5 13.25h15" />
      <path d="M10.25 12h3.5" />
    </SvgIcon>
  )
}

export function TeamIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <rect x="6.25" y="5" width="11.5" height="15" rx="1.75" />
      <path d="M9.5 5V3.75h5v1.25" />
      <circle cx="12" cy="11" r="2.6" />
      <path d="M8.75 17.25c.45-1.8 1.95-3 3.25-3s2.8 1.2 3.25 3" />
      <path d="M9.25 13.75h5.5" />
    </SvgIcon>
  )
}

export function ServicesIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 5.25v1.75" />
      <path d="M12 17v1.75" />
      <path d="M5.25 12h1.75" />
      <path d="M17 12h1.75" />
      <path d="M16.1 7.9 15 9" />
      <path d="M8.95 15.05 7.85 16.15" />
      <path d="M7.9 7.9 9 9" />
      <path d="M15.05 15.05 16.15 16.15" />
    </SvgIcon>
  )
}

export function ProductsIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="m4.5 8.75 7.5-4.25 7.5 4.25v8.5l-7.5 4.25-7.5-4.25v-8.5z" />
      <path d="M12 4.5v8.75l-7.5-4.5" />
      <path d="m19.5 8.75-7.5 4.5" />
    </SvgIcon>
  )
}

export function SuppliersIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6 20.25V9.25L12 5l6 4.25v11" />
      <path d="M4.5 20.25h15" />
      <path d="M9 20.25V15h6v5.25" />
      <path d="M9 12.75h6" />
      <path d="M9 10.25h6" />
    </SvgIcon>
  )
}

export function BudgetIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="M8.25 4.5h6L18.75 9v10.5H8.25z" />
      <path d="M14.25 4.5v4.5h4.5" />
      <path d="M10.25 12.25h4.5" />
      <path d="M10.25 15.25h3" />
      <path d="M11.25 9.75a1.75 1.75 0 0 1 0-3.5h2" />
      <path d="M11.25 9.75h2a1.75 1.75 0 0 1 0 3.5h-1.5a1.75 1.75 0 0 0 0 3.5h2" />
    </SvgIcon>
  )
}

export function LogoutIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="M14.5 6.75V5.5A2.5 2.5 0 0 0 12 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h4.5a2.5 2.5 0 0 0 2.5-2.5v-1.25" />
      <path d="M10 12h9" />
      <path d="m16.75 8.75 4 3.25-4 3.25" />
    </SvgIcon>
  )
}

export function LockIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <rect x="6.75" y="10" width="10.5" height="9.5" rx="2" />
      <path d="M9.5 10V7.75a2.5 2.5 0 0 1 5 0V10" />
      <path d="M12 13.25v2.5" />
      <circle cx="12" cy="13.25" r=".75" fill="currentColor" stroke="none" />
    </SvgIcon>
  )
}

export function EyeIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="M2.75 12s3.5-5.25 9.25-5.25S21.25 12 21.25 12s-3.5 5.25-9.25 5.25S2.75 12 2.75 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </SvgIcon>
  )
}

export function EyeOffIcon(props: IconBaseProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3 3.75 20.25 21" />
      <path d="M5 7.75C6.9 6.1 9.3 5 12 5c5.75 0 9.25 7 9.25 7a18 18 0 0 1-3.16 4.44" />
      <path d="M8.25 10.95a3 3 0 0 1 4.8-1.35" />
      <path d="M10.5 12.75A2.5 2.5 0 0 0 15 12" />
      <path d="M4.75 15.25C6.65 16.9 9.05 18 11.75 18c1.21 0 2.36-.25 3.45-.73" />
    </SvgIcon>
  )
}

