interface FilterButtonsProps {
  regions: string[];
  changeFilterKeyword: (keyword: string) => void;
}

export default function FilterButtons({
  regions, changeFilterKeyword,
}: FilterButtonsProps) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center' }}>
      {regions.map((region) => (
        <li
          key={region}
          style={{ marginInline: '4px' }}
        >
          <button
            type="button"
            onClick={
              (event) => changeFilterKeyword(event.currentTarget.textContent || '')
            }
          >
            {region}
          </button>
        </li>
      ))}
    </ul>
  );
}
