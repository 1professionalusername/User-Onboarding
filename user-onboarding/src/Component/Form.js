import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

const UsForm = ({ errors, touched, values, status }) => {
    const [animals, setAnimals] = useState([]);
    //console.log("this is touched", touched);
    useEffect(() => {
        if (status) {
            setAnimals([...animals, status]);
        }
    }, [status]);

    return (
        <div className="animal-form">
            <h1>Animal Form</h1>
            <Form>
                <Field type="text" name="name" placeholder="Name" />
                {/* touched is a prop from formik and is envoked when you click inside the textbox
        The syntax below is saying if the name field is touched and there are errors, display what is between the <p> tags */}
                {touched.name && errors.name && <p className="error">{errors.name}</p>}

                <Field type="text" name="email" placeholder="Email" />
                {touched.email && errors.email && (
                    <p className="error">{errors.email}</p>
                )}

                <Field type="text" name="password" placeholder="Password" />
                {touched.password && errors.password && (
                    <p className="error">{errors.password}</p>
                )}

                <label className="checkbox-container">
                    Terms of Service
                    <Field
                        type="checkbox"
                        name="termsOfService"
                        checked={values.termsOfService}
                    />
                    <span className="checkmark" />
                </label>

                <button type="submit">Submit!</button>
            </Form>
            {/* We are mapping through animal, with the state right at the top
        - We are setting up an un ordered list, going through each bit
        - It is being held by use state */}
            {animals.map(animal => (
                <ul key={animal.id}>
                    <li>Name: {animal.name}</li>
                    <li>Email: {animal.email}</li>
                    <li>Password: {animal.password}</li>
                </ul>
            ))}
        </div>
    );
};

// Higher Order Component - HOC
// Hard to share component / stateful logic (custom hooks)
// There is LOTs of shared logic between multiple components, and since we only want to write that logic one time and put it in one place and then extend that logic across thos ediffenet components
//HOC helps us with them that problem 👆
// Function that takes in a component, extends some logic onto that component,
// This function is actually going to call this function twice. This is called currying functions(We won't go over all that that entails today)
// returns a _new_ component (copy of the passed in component with the extended logic)
const FormikAnimalForm = withFormik({
    // object destructuring. We could do values.species but we are destructuring it so we can just put species. You see the same thing in Props a lot so in stead of props.values you would see {values}
    mapPropsToValues({ name, email, password, termsOfService }) {
        return {
            termsOfService: termsOfService || false,
            name: name || "",
            email: email || "",
            password: password || ""
        };
    },

    validationSchema: Yup.object().shape({
        name: Yup.string().required("You silly!!!"),
        email: Yup.string().required(),
        //.min(6, "Password must be 6 characters or longer"),
        password: Yup.string()
            .required()
            .min(6, "Password must be 6 characters or longer")
            .required("Password is required")
    }),

    handleSubmit(values, { setStatus }) {
        axios
            // values is our object with all our data on it.
            .post("https://reqres.in/api/users/", values)
            .then(res => {
                setStatus(res.data);
            })
            .catch(err => console.log(err.response));
    }
})(UsForm); // currying functions in Javascript
// console.log("This is the HOC", FormikAnimalForm)
export default FormikAnimalForm;

// What's going to happen is our animal form is going to be passed into withFormik()(AnimalForm). When we call functions they often return a value. This is a function call that is returning a value. And that value is a component. We are going to capture that value in a variable. const formikAnimalForm = what we are returning, withFormik()(AnimalForm)
// Now we have a copy of animalForm called FormikAnimalForm but it now has extended logic thanks to the withFormik function. So important part to note is by calling withFormik, and passing in AnimalForm we are creating a brand new component that is a copy of AnimalForm.
// So now we have to export default FormikAnimalForm instead.
