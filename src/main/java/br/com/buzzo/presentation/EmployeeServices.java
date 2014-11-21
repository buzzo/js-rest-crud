package br.com.buzzo.presentation;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import br.com.buzzo.domain.Employee;

import com.google.gson.Gson;

@Path("/employer")
public class EmployeeServices {

	private static final Set<Employee> database = new HashSet<Employee>();
	private static int id = 0;

	static {
		for (int i = 0; i < 35; i++) {
			Employee e = new Employee();
			e.setActive(i % 2 == 0);
			e.setId(++id);
			e.setCode("code_" + id);
			e.setName("name_" + id);
			e.setBadge("badg_" + id);
			e.setPosition("position_" + id);
			database.add(e);
		}
	}

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOne(@PathParam("id") String id) {
		System.out.println(" GET ---> "+ id);
		if (id == null || "".equals(id)) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		for (final Employee emp : database) {
			if (emp.getId() == Integer.parseInt(id)) {
				return Response.status(Status.OK)
						.entity(new Gson().toJson(emp)).build();
			}
		}
		return Response.status(Status.NOT_FOUND).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@QueryParam("limit") final int limit,
			@QueryParam("offset") final int offset,
			@QueryParam("order") final String order,
			@QueryParam("sort") final String sort,
			@QueryParam("search") final String search) {

		System.out.println("-->" + offset + " " + limit + " " + order + " "
				+ sort + "  " + search);

		return Response
				.status(Status.OK)
				.entity("{\"total\":" + database.size() + ",\"rows\":"
						+ new Gson().toJson(database) + "}").build();
	}

	@DELETE
	@Consumes(MediaType.TEXT_PLAIN)
	public Response remove(final String empToRemove) {
		if(empToRemove == null || "".equals(empToRemove.trim())) {
			System.out.println("REMOVE ID VAZIO: " + empToRemove);
			return Response.status(Status.NOT_FOUND).build();
		}
		System.out.println("REMOVE: " + empToRemove);
		for (final Employee emp : database) {
			if (emp.getId() == Integer.parseInt(empToRemove)) {
				database.remove(emp);
				return Response.status(Status.OK).build();
			}
		}
		return Response.status(Status.NOT_FOUND).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response put(final Employee emp) {
		System.out.println("UPDATE: " + emp.getName());
		// replace!
		database.remove(emp);
		database.add(emp);
		return Response.status(Status.OK).build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response post(Employee emp) {
		emp.setId(++id);
		System.out.println("ADD: " + emp.getId());
		database.add(emp);
		return Response.status(Status.OK).build();
	}

}
