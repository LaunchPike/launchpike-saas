import HighlightedFeature from './components/HighlightedFeature';
import aiReadyDark from '../client/static/assets/aiready-dark.webp';
import aiReady from '../client/static/assets/aiready.webp';

export default function AIReady() {
  return (
    <HighlightedFeature
      name='Ready-made Solutions for Quick Start'
      description='LaunchPike provides all the necessary components to create a full-featured SaaS product. From authentication to deployment - everything is already configured and ready to use.'
      highlightedComponent={<AIReadyExample />}
      direction='row-reverse'
    />
  );
}

const AIReadyExample = () => {
  return (
    <div className='w-full'>
      <img src={aiReady} alt='LaunchPike ready-made solutions' className='dark:hidden' />
      <img src={aiReadyDark} alt='LaunchPike ready-made solutions' className='hidden dark:block' />
    </div>
  );
};
