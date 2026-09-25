export default function ResuableTitleDescription({
    subTitle,
    title,
    description,
    align = 'center',
    subTitleClassName,
    titleClassName,
    descriptionClassName,
}: {
    subTitle: string;
    title: string;
    description: string;
    align?: 'left' | 'center';
    subTitleClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
}) {
    const isLeft = align === 'left';
    return (
        <div className={`flex flex-col ${isLeft ? 'items-start text-left' : 'items-center text-center'} gap-5`}>
            <p className={subTitleClassName}>
                <span className="text-xs md:text-sm font-bold font-display uppercase tracking-widest text-accent">
                    {subTitle}
                </span>
            </p>
            <h2 className={titleClassName}>
                {title}
            </h2>
            <p className={descriptionClassName}>
                {description}
            </p>
        </div>
    );
}
