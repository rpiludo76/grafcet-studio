import { ReactFlowProvider } from '@xyflow/react';
import { GrafcetEditor } from '@/components/grafcet/GrafcetEditor';

const Index = () => {
  return (
    <ReactFlowProvider>
      <GrafcetEditor />
    </ReactFlowProvider>
  );
};

export default Index;
