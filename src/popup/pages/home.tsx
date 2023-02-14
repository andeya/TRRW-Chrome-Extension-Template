import type {FC} from "react";
import { Suspense, useState} from "react";
import Button from "antd/es/button";
import Modal from "antd/es/modal";

const Home: FC<{}> = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Suspense fallback={<div>Loading...</div>}>
                <Modal
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    title="Rust WebAssembly Playground"
                    footer={null}
                    width={900}
                    style={{userSelect: 'text'}}
                >
                    <div style={{minHeight: 200}}>
                        <Button
                            onClick={async (): Promise<void> => {
                                const {greet} = await import('../../wasm');
                                greet();
                            }}
                        >
                            alert hello
                        </Button>
                    </div>
                </Modal>
            </Suspense>
        </div>
    );
};
export default Home;