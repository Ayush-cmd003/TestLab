export const normalizeVersions = (data) => {
    if (!data || data.length === 0) return [];
    const grouped = {};
    data.forEach(
        (item) => {
            const version = item.testcase_version;
            if (!grouped[version]) {
                grouped[version] = {
                    id: `v${version}`,
                    label: `Version ${version}`,
                    prompt_used: item.prompt_used,
                    created_at:
                        item.created_at,
                    items: [],
                };
            }

            grouped[version].items.push({
                id: item.id,
                testcaseId: item.testcase_id,
                title: item.testcase_name,
                type: item.testcase_type,
                preconditions: item.pre_conditions || [],
                steps: item.testcase_steps || [],
                expected: item.expected_result || "N/A"
            });
        }
    );

    return Object.values(grouped).sort((a, b) => Number(b.id.replace("v", "")) - Number(a.id.replace("v", "")));
}