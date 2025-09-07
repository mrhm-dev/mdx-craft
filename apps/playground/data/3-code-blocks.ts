export const codeBlocks = {
  id: 'code-blocks',
  title: 'Code Examples',
  description: 'Syntax highlighting and code blocks',
  content: `# Code Blocks

MDX supports syntax highlighting for various programming languages.

## JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(10)); // 55
\`\`\`

## TypeScript

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

class UserService {
  private users: Map<string, User> = new Map();
  
  addUser(user: User): void {
    this.users.set(user.id, user);
  }
  
  getUser(id: string): User | undefined {
    return this.users.get(id);
  }
}
\`\`\`

## React Component

\`\`\`jsx
const TodoItem = ({ todo, onToggle }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
    </div>
  );
};
\`\`\`

## CSS

\`\`\`css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
\`\`\`
`,
}
