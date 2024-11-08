import React from "react";
import styled from "styled-components";
import ConstructionIcon from '@mui/icons-material/Construction';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// import
class Board extends React.Component {
    state = {
        tasks: [
            {
                name: "add a task",
                descriptions: "yioooo",
                date: "12/12/2002",
                // hight, medium, low
                urgency: "high",
                worker: "samir",
                category: "todo"
            }
        ],
        newTask: {
            name: "",
            descriptions: "",
            date: "",
            urgency: "low",
            worker: "",
            category: "todo"
        }
    };

    onDragOver = ev => {
        ev.preventDefault();
    };
    onDragStart = (ev, name) => {
        ev.dataTransfer.setData("id", name);
        
    };
    onDrop = (ev, cat) => {
        const id = ev.dataTransfer.getData("id");
        console.log(cat, "cat")
        console.log(id, "id")


        let tasks = this.state.tasks.filter(task => {
            if (task.name == id) {
                task.category = cat;
            }
            return task;
        });
        this.setState({
            ...this.state,
            tasks
        });

    };

    handleKeyPress = ev => {
        if ((ev.key == "Enter") && (ev.target.value != "")) {
            this.setState({
                tasks: [
                    ...this.state.tasks,
                    { name: ev.target.value, category: "todo" }
                ]
            });
            ev.target.value = " ";
        }
    };
    // new code
    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            newTask: {
                ...prevState.newTask,
                [name]: value
            }
        }));
    };

    handleSubmit = async event => {
        event.preventDefault();

        const task = this.state.newTask;
        console.log(task, "task handle")

        try {
            const response = await fetch("https://localhost:7203/api/BordTasks/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...task, // Burada alan adlarına dikkat edin
                    date: new Date(task.date).toISOString(), // Tarih formatını ISO formatına dönüştür
                    urgency: task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1).toLowerCase() // Enum'a uygun hale getir
                }),
            });
            console.log(response)
        } catch (error) {
            console.error("Error:", error);
        }

        this.setState(prevState => ({
            tasks: [...prevState.tasks, task],
            newTask: {
                name: "",
                descriptions: "",
                date: "",
                urgency: "low",
                worker: "",
                category: "todo"
            }
        }));
    };


    render() {
        var tasks = {
            todo: [],
            working: [],
            complete: [],
            trash: []
        };

        this.state.tasks.forEach(t => {
            tasks[t.category].push(
                <Card
                    className="item-container"
                    key={t.name}
                    draggable
                    onDragStart={e => this.onDragStart(e, t.name)}
                >
                    <Urgency style={{
                        backgroundColor: t.urgency === 'high' ? "red" : t.urgency === 'medium' ? "yellow" : "green",
                        color: t.urgency === 'high' ? '#fff' : '#000'
                    }} ></Urgency>
                    <CardDate>
                        <CalendarMonthIcon />
                        {t.date}
                    </CardDate>

                    <CardName>
                        {t.name}
                    </CardName>
                    <CardDis>
                        {t.descriptions}
                    </CardDis>
                    {/* date */}
                    {/* urgency */}

                    {/* worker */}
                    <CardWorker>
                        <ConstructionIcon />
                        <Worker>
                            {t.worker}

                        </Worker>
                    </CardWorker>
                </Card>
            );
        });



        console.log(tasks)


        return (
            <GigaContainer>
                <Container>
                    <Column

                        className="drop-area"
                        onDragOver={e => this.onDragOver(e)}
                        onDrop={e => this.onDrop(e, "todo")}
                    >
                        <Title>Todo</Title>
                        {tasks.todo}
                        <Input>
                            {/* <Add
                                onKeyPress={e => this.handleKeyPress(e)}
                                className="input"
                                type="text"
                                placeholder="Task Name"
                            /> */}
                            <form onSubmit={this.handleSubmit}>
                                <InputWrapper>
                                    <InputLabel>Task Name:</InputLabel>
                                    <InputField
                                        type="text"
                                        name="name"
                                        value={this.state.newTask.name}
                                        onChange={this.handleInputChange}
                                        placeholder="Enter task name"
                                        required
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>Description:</InputLabel>
                                    <InputField
                                        type="text"
                                        name="descriptions"
                                        value={this.state.newTask.descriptions}
                                        onChange={this.handleInputChange}
                                        placeholder="Enter task description"
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>Urgency:</InputLabel>
                                    <SelectField
                                        name="urgency"
                                        value={this.state.newTask.urgency}
                                        onChange={this.handleInputChange}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </SelectField>
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>Date:</InputLabel>
                                    <InputField
                                        type="date"
                                        name="date"
                                        value={this.state.newTask.date}
                                        onChange={this.handleInputChange}
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>Assigned To:</InputLabel>
                                    <InputField
                                        type="text"
                                        name="worker"
                                        value={this.state.newTask.worker}
                                        onChange={this.handleInputChange}
                                        placeholder="Enter worker name"
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputField type="submit" value="Add Task" />
                                </InputWrapper>
                            </form>
                        </Input>
                    </Column>

                    <Column
                        className="drop-area"
                        onDragOver={e => this.onDragOver(e)}
                        onDrop={e => this.onDrop(e, "working")}
                    >
                        <Title>Working</Title>
                        {tasks.working}
                    </Column>

                    <Column
                        className="drop-area"
                        onDragOver={e => this.onDragOver(e)}
                        onDrop={e => this.onDrop(e, "complete")}
                    >
                        <Title>Complete</Title>
                        {tasks.complete}
                    </Column>
                    <Remove
                        className="trash-drop"
                        onDrop={e => this.onDrop(e, "trash")}
                        onDragOver={e => this.onDragOver(e)}
                    >
                        Drop here to remove
                    </Remove>

                </Container>
                {/* <Input /> */}
            </GigaContainer>
        );
    }
};

export default Board;


const GigaContainer = styled.div`
margin-top: 2vw;
padding-left: 5vw;
`
const Container = styled.div`
/* background-color: red; */
display: flex;
width: 80vw;
justify-content: space-around;
`
const Column = styled.div`
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  margin-right: 12px;
  min-height: 40px;
  width: 25%;
  background-color: #f4f5f7;
  color: black;
`
const Input = styled.div`
  background-color: #fff;
  border: none;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 45, 66, 0.25);
  color: #172b4d;
  font-size: 14px;
  padding: 8px;
  width: 100%;
`
const Add = styled.input`
  background-color: #ebecf0;
  border-radius: 3px;
  border: none;
  color: #6b808c;
  font-size: 14px;
  padding: 8px;
  text-align: left;
  width: 100%;
`
const Remove = styled.div`
  height: 100%;
  min-height: 100px;
  padding: 8px;
  transition: background-color 0.2s ease, border 0.2s ease;
  background-color: #f4f5f7;
  color: black;
  border-radius: 3px;
`

const Title = styled.h1`
font-family: arial;
font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
`
const Card = styled.div`
/* background-color: red; */
background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 45, 66, 0.25);
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  max-width: 300px;
  min-height: 20px;
  position: relative;
  z-index: 0;
  /* margin: 30px; */
`
const CardName = styled.div`
  font-weight: bold;
  font-size: 2vw;
  /* padding: 8px; */
  color: black; 
margin-left: 12px;
margin-bottom: 12px;

`
const CardDis = styled(CardName)`
color: gray;
font-size: 1.2vw;
margin-left: 12px;
margin-bottom: 30px;
`
const CardWorker = styled.div`
display: flex;
margin-left: 12px;
color: gray;
gap: 10px;
margin-bottom: 12px;
`
const CardDate = styled(CardWorker)`
color: gray;
margin-left: 12px;
display: flex;
`
const Urgency = styled.div`
width: 30%;
height: 8px;
border-radius: 20px;
margin-left: 12px;
margin-top: 12px;
margin-bottom: 10px;
`

const Worker = styled.div`
font-weight: bold;
`

// input 



const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const InputLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-bottom: 10px;
`;

const SelectField = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-bottom: 10px;
`;