package br.com.buzzo.presentation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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

	private static final List<Employee> database = new ArrayList<Employee>();
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
		System.out.println(" GET ---> " + id);
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

		Collections.sort(database, new EmployeeComp(sort,
				"desc".equals(order) ? true : false));

		int max = offset + limit;
		if (max > database.size()) {
			max = database.size() - 1;
		}

		return Response
				.status(Status.OK)
				.entity("{\"total\":" + database.size() + ",\"rows\":"
						+ new Gson().toJson(database.subList(offset, max))
						+ "}").build();
	}

	public static class EmployeeComp implements Comparator<Employee> {

		private String sort;
		private boolean desc;

		public EmployeeComp(final String sort, final boolean desc) {
			this.desc = desc;
			this.sort = sort;
		}

		public int compare(Employee o1, Employee o2) {
			if (desc) {
				Employee temp = o2;
				o2 = o1;
				o1 = temp;
			}
			if ("code".equals(sort)) {
				return o1.getCode().compareTo(o2.getCode());
			}
			if ("name".equals(sort)) {
				return o1.getName().compareTo(o2.getName());
			}
			if ("position".equals(sort)) {
				return o1.getPosition().compareTo(o2.getPosition());
			}
			if ("badge".equals(sort)) {
				return o1.getBadge().compareTo(o2.getBadge());
			}
			if ("active".equals(sort)) {
				return (o1.isActive() ? 1 : 0) - (o2.isActive() ? 1 : 0);
			}
			// fallback
			return (int) (o1.getId() - o2.getId());
		}

	}

	@DELETE
	@Consumes(MediaType.TEXT_PLAIN)
	public Response remove(final String empToRemove) {
		if (empToRemove == null || "".equals(empToRemove.trim())) {
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
