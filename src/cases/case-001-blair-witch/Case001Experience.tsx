import { ExperienceProvider } from '../../experience/ExperienceContext';
import { Experience } from '../../experience/Experience';

export default function Case001Experience() {
  return (
    <ExperienceProvider>
      <Experience />
    </ExperienceProvider>
  );
}
