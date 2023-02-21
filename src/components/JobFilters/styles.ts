
interface FilterContainerProps {
    sorting: boolean;
}

export const FiltersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: clamp(10px, 0.52vw, 0.52vw);

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: clamp(1px, 0.05vw, 0.05vw) solid #e1e1e1;
        padding: clamp(10px, 0.52vw, 0.52vw);
        border-radius: clamp(10px, 0.26vw, 0.26vw);
        cursor: pointer;
        background: ${({ sorting, theme }) => sorting ? theme.colors.primary : "white"};
        color: ${({ sorting, theme }) => sorting ? "white" : theme.colors.primary};
        font-weight: bold;
        font-size: clamp(13px, 0.677vw, 0.677vw);

        strong {
            font-size: clamp(18px, 0.9375vw, 0.9375vw);
            line-height: clamp(12px, 0.625vw, 0.625vw);
        }
    }
`;