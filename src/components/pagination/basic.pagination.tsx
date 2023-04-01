import { Button, Space } from "antd";
import { FC } from "react";
import { PaginationUIInterface, UrlType } from "../../interface/common";


const Pagination: FC<PaginationUIInterface> = ({ loading, next, prev, onNextClick, onPrevClick }) => {

    const handlePrev = () => {
        onPrevClick?.(prev);
    }

    const handleNext = () => {
        onNextClick?.(next);
    }

    return (
        <Space
            style={{ display: 'flex', justifyContent: 'end' }}
            align={'end'}
        >
            <Button
                onClick={handlePrev}
                disabled={!prev || loading}
            >Prev</Button>
            <Button
                onClick={handleNext}
                disabled={!next || loading}
            >
                Next
            </Button>
        </Space>
    )
}

export default Pagination;