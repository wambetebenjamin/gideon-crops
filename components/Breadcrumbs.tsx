import Link from "next/link";

type BreadcrumbsProps = {
  title: string;
  trail?: { href?: string; label: string }[];
  image?: string;
  short?: boolean;
};

export default function Breadcrumbs({
  title,
  trail = [],
  image = "/img/bg-img/24.jpg",
  short = false,
}: BreadcrumbsProps) {
  return (
    <div className="breadcrumb-area">
      <div
        className={`top-breadcrumb-area bg-img bg-overlay d-flex align-items-center justify-content-center${
          short ? " gc-breadcrumb-short" : ""
        }`}
        style={{ backgroundImage: `url(${image})` }}
      >
        <h1 className="gc-breadcrumb-title">{title}</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="Breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <i className="fa fa-home" /> Home
                  </Link>
                </li>
                {trail.map((item) => (
                  <li className="breadcrumb-item" key={item.label}>
                    {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                  </li>
                ))}
                <li className="breadcrumb-item active" aria-current="page">
                  {title}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
