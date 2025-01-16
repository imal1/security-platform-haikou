interface IProps {
  children: React.ReactNode;
  styles?: React.CSSProperties;
  classNames?: string;
  key?: string | number;
}

import surround from "@/assets/img/table/surround.svg";

export default function ({ children, styles = {}, classNames }: IProps) {
  return (
    <div style={styles} className={`${classNames} custom-flash-wrapper`}>
      {/* <span className="left-1"></span>
      <span className="left-2"></span>
      <span className="right-1"></span>
      <span className="right-2"></span> */}
      <img src={surround} className="surround" alt="" />
      <img src={surround} className="surround2" alt="" />
      <img src={surround} className="surround3" alt="" />
      <img src={surround} className="surround4" alt="" />
      {children}
    </div>
  );
}
