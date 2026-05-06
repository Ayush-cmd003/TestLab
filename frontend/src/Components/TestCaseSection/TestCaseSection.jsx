export function Section({ title, content, list }) {
    return (
        <div>
            <h4 className="font-semibold mb-2">
                {title}
            </h4>
            {content && (
                Array.isArray(content) ? (
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                        {content.map((item, index) => (
                            <li key={index}>
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-600">
                        {content}
                    </p>
                )
            )}
            {list && (
                <ol className="list-decimal list-inside space-y-2 text-slate-600">
                    {list.map((item, index) => (
                        <li key={index}>
                            {item}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}